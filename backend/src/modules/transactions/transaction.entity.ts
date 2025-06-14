import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Concert } from '../concerts/concert.entity';

export enum TransactionType {
  RESERVATION_CREATED = 'reservation_created',
  RESERVATION_CANCELLED = 'reservation_cancelled',
}

@Entity()
export class Transaction {
  @ApiProperty({
    description: 'Unique identifier of the transaction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Type of the transaction',
    enum: TransactionType,
    example: TransactionType.RESERVATION_CREATED,
  })
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'The concert this transaction is related to',
    type: () => Concert,
  })
  @ManyToOne(() => Concert, (concert) => concert.transactions)
  concert: Concert;

  @ApiProperty({
    description: 'Email of the customer who made the transaction',
    example: 'customer@example.com',
  })
  @Column()
  customerEmail: string;

  @ApiProperty({
    description: 'Date and time when the transaction was created',
  })
  @CreateDateColumn()
  createdAt: Date;
}
