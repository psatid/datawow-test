import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Concert } from '../concerts/concert.entity';
import { Reservation, ReservationStatus } from './reservation.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/transaction.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    private transactionsService: TransactionsService,
    private dataSource: DataSource,
  ) {}

  private async findExistingReservation(
    concertId: string,
    customerEmail: string,
  ): Promise<Reservation | null> {
    return await this.reservationRepository.findOne({
      where: {
        concert: { id: concertId },
        customerEmail,
      },
      relations: ['concert'],
    });
  }

  private async handleExistingReservation(
    reservation: Reservation,
  ): Promise<Reservation> {
    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new BadRequestException({
        code: 'RESERVATION_ALREADY_CONFIRMED',
        message: 'You already have a confirmed reservation for this concert',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      reservation.status = ReservationStatus.CONFIRMED;
      const savedReservation = await queryRunner.manager.save(reservation);

      await this.transactionsService.createTransactionWithQueryRunner(
        queryRunner,
        reservation.concert,
        reservation.customerEmail,
        TransactionType.RESERVATION_CREATED,
      );

      await queryRunner.commitTransaction();
      return savedReservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Failed to reactivate reservation:', error);
      throw new InternalServerErrorException({
        code: 'RESERVATION_REACTIVATION_FAILED',
        message: 'Failed to reactivate reservation',
      });
    } finally {
      await queryRunner.release();
    }
  }

  private validateAvailableSeats(concert: Concert): void {
    const activeReservations = concert.reservations.filter(
      (r) => r.status === ReservationStatus.CONFIRMED,
    ).length;
    if (activeReservations >= concert.seats) {
      throw new BadRequestException({
        code: 'NO_SEATS_AVAILABLE',
        message: 'No seats available for this concert',
      });
    }
  }

  private async createReservation(
    concert: Concert,
    customerEmail: string,
  ): Promise<Reservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = this.reservationRepository.create({
        customerEmail,
        concert,
        status: ReservationStatus.CONFIRMED,
      });

      const savedReservation = await queryRunner.manager.save(reservation);
      await this.transactionsService.createTransactionWithQueryRunner(
        queryRunner,
        concert,
        customerEmail,
        TransactionType.RESERVATION_CREATED,
      );

      await queryRunner.commitTransaction();
      return savedReservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        code: 'RESERVATION_CREATION_FAILED',
        message: 'Failed to create reservation',
        error,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async reserveSeat(
    concertId: string,
    customerEmail: string,
  ): Promise<Reservation> {
    const concert = await this.concertRepository.findOne({
      where: { id: concertId },
      relations: ['reservations'],
    });

    if (!concert) {
      throw new NotFoundException({
        code: 'CONCERT_NOT_FOUND',
        message: 'Concert not found',
      });
    }

    const existingReservation = await this.findExistingReservation(
      concertId,
      customerEmail,
    );

    if (existingReservation) {
      return this.handleExistingReservation(existingReservation);
    }

    this.validateAvailableSeats(concert);
    return this.createReservation(concert, customerEmail);
  }

  private async validateCancellationRequest(
    concertId: string,
    customerEmail: string,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { concert: { id: concertId }, customerEmail },
      relations: ['concert'],
    });

    if (!reservation) {
      throw new NotFoundException({
        code: 'RESERVATION_NOT_FOUND',
        message: 'Reservation not found for this concert',
      });
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException({
        code: 'RESERVATION_NOT_CONFIRMED',
        message: 'Only confirmed reservations can be cancelled',
      });
    }

    return reservation;
  }

  async cancelReservation(
    concertId: string,
    customerEmail: string,
  ): Promise<void> {
    const reservation = await this.validateCancellationRequest(
      concertId,
      customerEmail,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      reservation.status = ReservationStatus.CANCELLED;
      await queryRunner.manager.save(reservation);

      await this.transactionsService.createTransactionWithQueryRunner(
        queryRunner,
        reservation.concert,
        customerEmail,
        TransactionType.RESERVATION_CANCELLED,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        code: 'RESERVATION_CANCELLATION_FAILED',
        message: 'Failed to cancel reservation',
        error,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async getUserReservations(customerEmail: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { customerEmail },
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }
}
