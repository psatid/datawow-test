import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { TransactionType } from './transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockTransactionsService = {
    getTransactionHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTransaction', () => {
    it('should return an array of transactions', async () => {
      const mockTransactions: Partial<Transaction>[] = [
        {
          id: '1',
          type: TransactionType.RESERVATION_CREATED,
          customerEmail: 'test@example.com',
          createdAt: new Date(),
        },
        {
          id: '2',
          type: TransactionType.RESERVATION_CANCELLED,
          customerEmail: 'test@example.com',
          createdAt: new Date(),
        },
      ];

      mockTransactionsService.getTransactionHistory.mockResolvedValue(
        mockTransactions,
      );

      const result = await controller.getAllTransaction();

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionsService.getTransactionHistory).toHaveBeenCalled();
    });

    it('should handle empty transaction history', async () => {
      mockTransactionsService.getTransactionHistory.mockResolvedValue([]);

      const result = await controller.getAllTransaction();

      expect(result).toEqual([]);
      expect(mockTransactionsService.getTransactionHistory).toHaveBeenCalled();
    });
  });
});
