import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Reservation } from '../concerts/reservation.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('reservations')
  async getUserReservations(
    @Query('email') email: string,
  ): Promise<Reservation[]> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.usersService.getUserReservations(email);
  }
}
