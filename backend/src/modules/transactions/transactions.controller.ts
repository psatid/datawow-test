import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionRespones } from './transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get transaction history',
    description: 'Get a list of all transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions retrieved successfully',
    type: [TransactionRespones],
  })
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
