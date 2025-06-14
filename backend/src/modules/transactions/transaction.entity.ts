import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Concert } from '../concerts/concert.entity';

export enum TransactionType {
  RESERVATION_CREATED = 'reservation_created',
  RESERVATION_CANCELLED = 'reservation_cancelled',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ManyToOne(() => Concert, (concert) => concert.transactions)
  concert: Concert;

  @Column()
  customerEmail: string;

  @CreateDateColumn()
  createdAt: Date;
}
