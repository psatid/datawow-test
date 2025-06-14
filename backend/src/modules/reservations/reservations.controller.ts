import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('')
  async getUserReservations(
    @Query('email') email: string,
  ): Promise<Reservation[]> {
    if (!email) {
      throw new BadRequestException({
        code: 'EMAIL_NOT_PROVIDED',
        message: 'Email query parameter is required.',
      });
    }
    return this.reservationsService.getUserReservations(email);
  }
}
