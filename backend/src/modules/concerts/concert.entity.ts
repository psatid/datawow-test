import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../reservations/reservation.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Concert {
  @ApiProperty({
    description: 'Unique identifier of the concert',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the concert',
    example: 'Summer Music Festival',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the concert',
    example: 'A fantastic summer concert featuring various artists',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Total number of available seats',
    example: 100,
  })
  @Column()
  seats: number;

  @ApiProperty({
    description: 'Date and time when the concert was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the concert was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'List of reservations for this concert',
    type: () => [Reservation],
  })
  @OneToMany(() => Reservation, (reservation) => reservation.concert)
  reservations: Reservation[];

  @ApiProperty({
    description: 'List of transactions related to this concert',
    type: () => [Transaction],
  })
  @OneToMany(() => Transaction, (transaction) => transaction.concert)
  transactions: Transaction[];
}
