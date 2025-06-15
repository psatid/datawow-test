import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionRespones } from './transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('')
  async getAllTransaction(): Promise<TransactionRespones[]> {
    const transactions = await this.transactionsService.getTransactionHistory();
    return transactions.map((transaction) => {
      return {
        id: transaction.id,
        concertName: transaction.concert.name,
        userEmail: transaction.customerEmail,
        type: transaction.type,
        date: transaction.createdAt.toISOString(),
      };
    });
  }
}
