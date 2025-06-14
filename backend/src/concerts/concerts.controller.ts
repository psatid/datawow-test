import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import {
  CreateReservationDto,
  CancelReservationDto,
} from './dto/create-reservation.dto';
import { Concert } from './concert.entity';
import { Reservation } from './reservation.entity';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  // Admin endpoints
  @Post()
  async createConcert(
    @Body() createConcertDto: CreateConcertDto,
  ): Promise<Concert> {
    return this.concertsService.createConcert(createConcertDto);
  }

  @Delete(':id')
  async deleteConcert(@Param('id') id: string): Promise<void> {
    return this.concertsService.deleteConcert(id);
  }

  // User endpoints
  @Get()
  async getAllConcerts(): Promise<Concert[]> {
    return this.concertsService.getAllConcerts();
  }

  @Post(':concertId/reserve')
  async reserveSeat(
    @Param('concertId') concertId: string,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return this.concertsService.reserveSeat(
      concertId,
      createReservationDto.customerEmail,
    );
  }

  @Post(':concertId/cancel')
  async cancelReservation(
    @Param('concertId') concertId: string,
    @Body() cancelReservationDto: CancelReservationDto,
  ): Promise<void> {
    return this.concertsService.cancelReservation(
      concertId,
      cancelReservationDto.customerEmail,
    );
  }
}
