import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsEmail()
  @IsNotEmpty()
  readonly customerEmail: string;
}

export class CancelReservationDto {
  @IsEmail()
  @IsNotEmpty()
  readonly customerEmail: string;
}
