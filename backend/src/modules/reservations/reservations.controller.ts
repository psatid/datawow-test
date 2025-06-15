import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';
import { GetUserReservationsDto } from './dto/reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('')
  async getUserReservations(
    @Query('email') email: string,
  ): Promise<GetUserReservationsDto[]> {
    if (!email) {
      throw new BadRequestException({
        code: 'EMAIL_NOT_PROVIDED',
        message: 'Email query parameter is required.',
      });
    }
    const reservations =
      await this.reservationsService.getUserReservations(email);
    return reservations.map((reservation) => {
      return {
        id: reservation.id,
        concertId: reservation.concert.id,
        status: reservation.status,
      };
    });
  }
}
