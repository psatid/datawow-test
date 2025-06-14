import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './concert.entity';
import { Reservation, ReservationStatus } from './reservation.entity';
import { Transaction, TransactionType } from './transaction.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createConcert(createConcertDto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertRepository.create(createConcertDto);
    return await this.concertRepository.save(concert);
  }

  async getAllConcerts(): Promise<Concert[]> {
    return await this.concertRepository.find({
      relations: ['reservations'],
    });
  }

  async getConcert(id: string): Promise<Concert> {
    const concert = await this.concertRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });
    if (!concert) {
      throw new NotFoundException('Concert not found');
    }
    return concert;
  }

  async deleteConcert(id: string): Promise<void> {
    const result = await this.concertRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Concert not found');
    }
  }

  async reserveSeat(
    concertId: string,
    customerEmail: string,
  ): Promise<Reservation> {
    const concert = await this.getConcert(concertId);
    const existingReservation = await this.findExistingReservation(
      concertId,
      customerEmail,
    );

    if (existingReservation) {
      return this.handleExistingReservation(existingReservation);
    }

    this.validateAvailableSeats(concert);
    return this.createNewReservation(concert, customerEmail);
  }

  private async findExistingReservation(
    concertId: string,
    customerEmail: string,
  ): Promise<Reservation | null> {
    return await this.reservationRepository.findOne({
      where: {
        concert: { id: concertId },
        customerEmail,
      },
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

  private async createTransaction(
    concert: Concert,
    customerEmail: string,
    type: TransactionType,
  ): Promise<void> {
    const transaction = this.transactionRepository.create({
      type,
      concert,
      customerEmail,
    });
    await this.transactionRepository.save(transaction);
  }

  private async createNewReservation(
    concert: Concert,
    customerEmail: string,
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      customerEmail,
      concert,
      status: ReservationStatus.CONFIRMED,
    });

    const savedReservation = await this.reservationRepository.save(reservation);
    await this.createTransaction(
      concert,
      customerEmail,
      TransactionType.RESERVATION_CREATED,
    );

    return savedReservation;
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
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = ReservationStatus.CANCELLED;
    await this.reservationRepository.save(reservation);
    await this.createTransaction(
      reservation.concert,
      customerEmail,
      TransactionType.RESERVATION_CANCELLED,
    );
  }

  async getReservationHistory(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }
}
