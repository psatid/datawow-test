import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsNumberOptions,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConcertDto {
  @ApiProperty({
    description: 'The name of the concert',
    example: 'Summer Music Festival',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'A description of the concert',
    example: 'A fantastic summer concert featuring various artists',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    description: 'The number of available seats for the concert',
    minimum: 1,
    example: 100,
  })
  @Type(() => Number)
  @IsNumber(undefined as unknown as IsNumberOptions)
  @Min(1)
  readonly seats: number;
}
