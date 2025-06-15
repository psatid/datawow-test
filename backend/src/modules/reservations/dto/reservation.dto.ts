import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../reservation.entity';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Email address of the customer making the reservation',
    example: 'customer@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly customerEmail: string;
}

export class CancelReservationDto {
  @ApiProperty({
    description: 'Email address of the customer who made the reservation',
    example: 'customer@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly customerEmail: string;
}

export class GetUserReservationsDto {
  id: string;
  concertId: string;
  status: ReservationStatus;
}
