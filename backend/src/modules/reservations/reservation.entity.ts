import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Concert } from '../concerts/concert.entity';

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Reservation {
  @ApiProperty({
    description: 'Unique identifier of the reservation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Email of the customer who made the reservation',
    example: 'customer@example.com',
  })
  @Column()
  customerEmail: string;

  @ApiProperty({
    description: 'Status of the reservation',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.CONFIRMED,
  })
  status: ReservationStatus;

  @ApiProperty({
    description: 'The concert this reservation is for',
    type: () => Concert,
  })
  @ManyToOne(() => Concert, (concert) => concert.reservations)
  concert: Concert;

  @ApiProperty({
    description: 'Date and time when the reservation was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the reservation was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
