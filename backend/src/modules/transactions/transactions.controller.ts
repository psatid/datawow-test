import { Controller, Get } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('')
  async getAllTransaction(): Promise<Transaction[]> {
    return this.transactionsService.getTransactionHistory();
  }
}
