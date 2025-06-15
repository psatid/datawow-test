import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionType } from './transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let mockTransactionsService: any;

  beforeEach(async () => {
    mockTransactionsService = {
      getTransactionHistory: jest.fn(),
    };

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
      const mockTransactions = [
        {
          id: '1',
          customerEmail: 'test@example.com',
          type: TransactionType.RESERVATION_CREATED,
          concert: {
            id: '1',
            name: 'Test Concert',
            description: 'Test Description',
            seats: 100,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTransactionsService.getTransactionHistory.mockResolvedValue(
        mockTransactions,
      );

      const result = await controller.getAllTransaction();
      expect(result[0].concertName).toBe('Test Concert');
      expect(result[0].userEmail).toBe('test@example.com');
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
