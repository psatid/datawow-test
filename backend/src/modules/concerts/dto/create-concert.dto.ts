import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsNumberOptions,
} from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @Type(() => Number)
  @IsNumber(undefined as unknown as IsNumberOptions)
  @Min(1)
  readonly seats: number;
}
