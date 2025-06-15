import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './concert.entity';
import { ReservationsService } from '../reservations/reservations.service';
import {
  CreateReservationDto,
  CancelReservationDto,
} from '../reservations/dto/reservation.dto';
import { Reservation } from '../reservations/reservation.entity';
import { GetConcertResponseDto } from './dto/concert-resopnse.dto';
import { mapConcertEntityToGetConcertResponseDto } from './concerts.mapper';

@ApiTags('Concerts')
@Controller('concerts')
export class ConcertsController {
  constructor(
    private readonly concertsService: ConcertsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  // Admin endpoints
  @Post()
  @ApiOperation({
    summary: 'Create a new concert',
    description: 'Admin endpoint to create a new concert',
  })
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
  async getAllConcerts(): Promise<GetConcertResponseDto> {
    const concerts = await this.concertsService.getAllConcerts();
    return mapConcertEntityToGetConcertResponseDto(concerts);
  }

  @Post(':concertId/reserve')
  async reserveSeat(
    @Param('concertId') concertId: string,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return this.reservationsService.reserveSeat(
      concertId,
      createReservationDto.customerEmail,
    );
  }

  @Put(':concertId/cancel')
  async cancelReservation(
    @Param('concertId') concertId: string,
    @Body() cancelReservationDto: CancelReservationDto,
  ): Promise<void> {
    return this.reservationsService.cancelReservation(
      concertId,
      cancelReservationDto.customerEmail,
    );
  }
}
