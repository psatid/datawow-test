import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { Concert } from '../concerts/concert.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createReservationTransaction(
    concert: Concert,
    customerEmail: string,
  ): Promise<void> {
    const transaction = this.transactionRepository.create({
      type: TransactionType.RESERVATION_CREATED,
      concert,
      customerEmail,
    });
    await this.transactionRepository.save(transaction);
  }

  async createCancellationTransaction(
    concert: Concert,
    customerEmail: string,
  ): Promise<void> {
    const transaction = this.transactionRepository.create({
      type: TransactionType.RESERVATION_CANCELLED,
      concert,
      customerEmail,
    });
    await this.transactionRepository.save(transaction);
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }
}
