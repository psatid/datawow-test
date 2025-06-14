import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from '../concerts/concert.entity';
import { Reservation, ReservationStatus } from './reservation.entity';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    private transactionsService: TransactionsService,
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

    reservation.status = ReservationStatus.CONFIRMED;
    return await this.reservationRepository.save(reservation);
  }

  private validateAvailableSeats(concert: Concert): void {
    const activeReservations = this.countActiveReservations(concert);
    if (activeReservations >= concert.seats) {
      throw new BadRequestException({
        code: 'NO_SEATS_AVAILABLE',
        message: 'No seats available for this concert',
      });
    }
  }

  private countActiveReservations(concert: Concert): number {
    return concert.reservations.filter(
      (r) => r.status === ReservationStatus.CONFIRMED,
    ).length;
  }

  private async createReservation(
    concert: Concert,
    customerEmail: string,
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      customerEmail,
      concert,
      status: ReservationStatus.CONFIRMED,
    });

    const savedReservation = await this.reservationRepository.save(reservation);
    await this.transactionsService.createReservationTransaction(
      concert,
      customerEmail,
    );

    return savedReservation;
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

  async cancelReservation(
    concertId: string,
    customerEmail: string,
  ): Promise<void> {
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

    reservation.status = ReservationStatus.CANCELLED;
    await this.reservationRepository.save(reservation);
    await this.transactionsService.createCancellationTransaction(
      reservation.concert,
      customerEmail,
    );
  }

  async getReservationHistory(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserReservations(customerEmail: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { customerEmail },
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }
}
