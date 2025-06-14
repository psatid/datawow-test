import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryRunner } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './transaction.entity';
import { Concert } from '../concerts/concert.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockQueryRunner = {
    manager: {
      save: jest.fn(),
    },
  };

  const mockConcert: Partial<Concert> = {
    id: '1',
    name: 'Test Concert',
    seats: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservationTransaction', () => {
    it('should create a reservation transaction', async () => {
      const customerEmail = 'test@example.com';
      const mockTransaction = {
        id: '1',
        type: TransactionType.RESERVATION_CREATED,
      };

      mockRepository.create.mockReturnValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);

      await service.createReservationTransaction(
        mockConcert as Concert,
        customerEmail,
      );

      expect(mockRepository.create).toHaveBeenCalledWith({
        type: TransactionType.RESERVATION_CREATED,
        concert: mockConcert,
        customerEmail,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('createCancellationTransaction', () => {
    it('should create a cancellation transaction', async () => {
      const customerEmail = 'test@example.com';
      const mockTransaction = {
        id: '1',
        type: TransactionType.RESERVATION_CANCELLED,
      };

      mockRepository.create.mockReturnValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);

      await service.createCancellationTransaction(
        mockConcert as Concert,
        customerEmail,
      );

      expect(mockRepository.create).toHaveBeenCalledWith({
        type: TransactionType.RESERVATION_CANCELLED,
        concert: mockConcert,
        customerEmail,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('getTransactionHistory', () => {
    it('should return transaction history', async () => {
      const mockTransactions = [
        { id: '1', type: TransactionType.RESERVATION_CREATED },
        { id: '2', type: TransactionType.RESERVATION_CANCELLED },
      ];

      mockRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.getTransactionHistory();

      expect(result).toEqual(mockTransactions);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['concert'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('createTransactionWithQueryRunner', () => {
    it('should create transaction using query runner', async () => {
      const customerEmail = 'test@example.com';
      const type = TransactionType.RESERVATION_CREATED;
      const mockTransaction = { id: '1', type };

      mockRepository.create.mockReturnValue(mockTransaction);

      await service.createTransactionWithQueryRunner(
        mockQueryRunner as unknown as QueryRunner,
        mockConcert as Concert,
        customerEmail,
        type,
      );

      expect(mockRepository.create).toHaveBeenCalledWith({
        type,
        concert: mockConcert,
        customerEmail,
      });
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        mockTransaction,
      );
    });
  });
});
