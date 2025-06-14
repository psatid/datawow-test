import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../concerts/reservation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async getUserReservations(customerEmail: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { customerEmail },
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }
}
