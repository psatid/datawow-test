import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

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
    type: [Transaction],
  })
  async getAllTransaction(): Promise<Transaction[]> {
    return this.transactionsService.getTransactionHistory();
  }
}
