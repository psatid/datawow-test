import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { Concert } from '../concerts/concert.entity';
import { TransactionType } from '../transactions/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { Reservation, ReservationStatus } from './reservation.entity';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let mockReservationRepository: Partial<Repository<Reservation>>;
  let mockConcertRepository: Partial<Repository<Concert>>;
  let mockTransactionsService: Partial<TransactionsService>;
  let mockDataSource: Partial<DataSource>;
  let mockQueryRunner: Partial<QueryRunner>;
  let mockEntityManager: Partial<EntityManager>;

  beforeEach(async () => {
    mockEntityManager = {
      save: jest.fn(),
    };

    mockReservationRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    mockConcertRepository = {
      findOne: jest.fn(),
    };

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: mockEntityManager as EntityManager,
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    mockTransactionsService = {
      createTransactionWithQueryRunner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserveSeat', () => {
    const concertId = '1';
    const customerEmail = 'test@example.com';
    const mockConcert = {
      id: concertId,
      name: 'Test Concert',
      seats: 100,
      reservations: [],
    };

    it('should create a new reservation if none exists', async () => {
      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(
        mockConcert,
      );
      (mockReservationRepository.findOne as jest.Mock).mockResolvedValue(null);
      const mockReservation = {
        id: '1',
        customerEmail,
        concert: mockConcert,
        status: ReservationStatus.CONFIRMED,
      };
      (mockReservationRepository.create as jest.Mock).mockReturnValue(
        mockReservation,
      );
      (mockEntityManager.save as jest.Mock).mockResolvedValue(mockReservation);

      const result = await service.reserveSeat(concertId, customerEmail);

      expect(result).toBe(mockReservation);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(
        mockTransactionsService.createTransactionWithQueryRunner,
      ).toHaveBeenCalledWith(
        mockQueryRunner,
        mockConcert,
        customerEmail,
        TransactionType.RESERVATION_CREATED,
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException when concert does not exist', async () => {
      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.reserveSeat(concertId, customerEmail),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reactivate a cancelled reservation', async () => {
      const mockExistingReservation = {
        id: '1',
        customerEmail,
        concert: mockConcert,
        status: ReservationStatus.CANCELLED,
      };
      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(
        mockConcert,
      );
      (mockReservationRepository.findOne as jest.Mock).mockResolvedValue(
        mockExistingReservation,
      );
      (mockEntityManager.save as jest.Mock).mockResolvedValue({
        ...mockExistingReservation,
        status: ReservationStatus.CONFIRMED,
      });

      const result = await service.reserveSeat(concertId, customerEmail);

      expect(result.status).toBe(ReservationStatus.CONFIRMED);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(
        mockTransactionsService.createTransactionWithQueryRunner,
      ).toHaveBeenCalledWith(
        mockQueryRunner,
        mockConcert,
        customerEmail,
        TransactionType.RESERVATION_CREATED,
      );
    });

    it('should throw BadRequestException when user already has a confirmed reservation', async () => {
      const mockExistingReservation = {
        id: '1',
        customerEmail,
        concert: mockConcert,
        status: ReservationStatus.CONFIRMED,
      };
      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(
        mockConcert,
      );
      (mockReservationRepository.findOne as jest.Mock).mockResolvedValue(
        mockExistingReservation,
      );

      await expect(
        service.reserveSeat(concertId, customerEmail),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no seats are available', async () => {
      const fullConcert = {
        ...mockConcert,
        seats: 1,
        reservations: [
          {
            id: '2',
            customerEmail: 'other@example.com',
            status: ReservationStatus.CONFIRMED,
          },
        ],
      };
      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(
        fullConcert,
      );
      (mockReservationRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.reserveSeat(concertId, customerEmail),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelReservation', () => {
    const concertId = '1';
    const customerEmail = 'test@example.com';
    const mockConcert = {
      id: concertId,
      name: 'Test Concert',
    };

    it('should cancel an existing confirmed reservation', async () => {
      const mockReservation = {
        id: '1',
        customerEmail,
        concert: mockConcert,
        status: ReservationStatus.CONFIRMED,
      };
      (mockReservationRepository.findOne as jest.Mock).mockResolvedValue(
        mockReservation,
      );

      await service.cancelReservation(concertId, customerEmail);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalledWith({
        ...mockReservation,
        status: ReservationStatus.CANCELLED,
      });
      expect(
        mockTransactionsService.createTransactionWithQueryRunner,
      ).toHaveBeenCalledWith(
        mockQueryRunner,
        mockConcert,
        customerEmail,
        TransactionType.RESERVATION_CANCELLED,
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException when reservation does not exist', async () => {
      (mockReservationRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.cancelReservation(concertId, customerEmail),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when trying to cancel already cancelled reservation', async () => {
      const mockReservation = {
        id: '1',
        customerEmail,
        concert: mockConcert,
        status: ReservationStatus.CANCELLED,
      };
      (mockReservationRepository.findOne as jest.Mock).mockResolvedValue(
        mockReservation,
      );

      await expect(
        service.cancelReservation(concertId, customerEmail),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserReservations', () => {
    const customerEmail = 'test@example.com';

    it('should return user reservations ordered by creation date', async () => {
      const mockReservations = [
        {
          id: '1',
          customerEmail,
          status: ReservationStatus.CONFIRMED,
          createdAt: new Date('2025-06-14T10:00:00'),
        },
        {
          id: '2',
          customerEmail,
          status: ReservationStatus.CANCELLED,
          createdAt: new Date('2025-06-14T09:00:00'),
        },
      ];
      (mockReservationRepository.find as jest.Mock).mockResolvedValue(
        mockReservations,
      );

      const result = await service.getUserReservations(customerEmail);

      expect(result).toEqual(mockReservations);
      expect(mockReservationRepository.find).toHaveBeenCalledWith({
        where: { customerEmail },
        relations: ['concert'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when user has no reservations', async () => {
      (mockReservationRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.getUserReservations(customerEmail);

      expect(result).toEqual([]);
    });
  });
});
