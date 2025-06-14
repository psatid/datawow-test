import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  seats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.concert)
  reservations: Reservation[];

  @OneToMany(() => Transaction, (transaction) => transaction.concert)
  transactions: Transaction[];
}
