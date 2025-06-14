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
  @ApiBody({ type: CreateConcertDto })
  @ApiResponse({
    status: 201,
    description: 'Concert created successfully',
    type: Concert,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createConcert(
    @Body() createConcertDto: CreateConcertDto,
  ): Promise<Concert> {
    return this.concertsService.createConcert(createConcertDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a concert',
    description: 'Admin endpoint to delete an existing concert',
  })
  @ApiParam({ name: 'id', description: 'Concert ID' })
  @ApiResponse({ status: 200, description: 'Concert deleted successfully' })
  @ApiResponse({ status: 404, description: 'Concert not found' })
  async deleteConcert(@Param('id') id: string): Promise<void> {
    return this.concertsService.deleteConcert(id);
  }

  // User endpoints
  @Get()
  @ApiOperation({
    summary: 'Get all concerts',
    description: 'Get a list of all available concerts',
  })
  @ApiResponse({
    status: 200,
    description: 'List of concerts retrieved successfully',
    type: [Concert],
  })
  async getAllConcerts(): Promise<Concert[]> {
    return this.concertsService.getAllConcerts();
  }

  @Post(':concertId/reserve')
  @ApiOperation({
    summary: 'Reserve a concert seat',
    description: 'Create a new reservation for a specific concert',
  })
  @ApiParam({ name: 'concertId', description: 'Concert ID' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully',
    type: Reservation,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or no seats available',
  })
  @ApiResponse({ status: 404, description: 'Concert not found' })
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
  @ApiOperation({
    summary: 'Cancel a reservation',
    description: 'Cancel an existing reservation for a concert',
  })
  @ApiParam({ name: 'concertId', description: 'Concert ID' })
  @ApiBody({ type: CancelReservationDto })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Concert or reservation not found' })
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
