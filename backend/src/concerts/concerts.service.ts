import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './concert.entity';
import { Reservation, ReservationStatus } from './reservation.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
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

    // Check if user already has an active reservation for this concert
    const existingReservation = await this.reservationRepository.findOne({
      where: {
        concert: { id: concertId },
        customerEmail,
      },
    });

    if (existingReservation) {
      if (existingReservation.status === ReservationStatus.CONFIRMED) {
        throw new BadRequestException(
          'User already has an active reservation for this concert',
        );
      } else if (existingReservation.status === ReservationStatus.CANCELLED) {
        existingReservation.status = ReservationStatus.CONFIRMED;
        return await this.reservationRepository.save(existingReservation);
      }
    }

    // Check available seats
    const activeReservations = concert.reservations.filter(
      (r) => r.status === ReservationStatus.CONFIRMED,
    ).length;

    if (activeReservations >= concert.seats) {
      throw new BadRequestException('No seats available');
    }

    const reservation = this.reservationRepository.create({
      customerEmail,
      concert,
      status: ReservationStatus.CONFIRMED,
    });

    return await this.reservationRepository.save(reservation);
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
  }

  async getReservationHistory(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }
}
