import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertsService } from './concerts.service';
import { Concert } from './concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let mockConcertRepository: Partial<Repository<Concert>>;

  beforeEach(async () => {
    mockConcertRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConcert', () => {
    it('should create a new concert', async () => {
      const createConcertDto: CreateConcertDto = {
        name: 'Test Concert',
        description: 'A test concert',
        seats: 100,
      };
      const mockConcert = {
        id: '1',
        ...createConcertDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        reservations: [],
        transactions: [],
      };

      (mockConcertRepository.create as jest.Mock).mockReturnValue(mockConcert);
      (mockConcertRepository.save as jest.Mock).mockResolvedValue(mockConcert);

      const result = await service.createConcert(createConcertDto);

      expect(result).toBe(mockConcert);
      expect(mockConcertRepository.create).toHaveBeenCalledWith(
        createConcertDto,
      );
      expect(mockConcertRepository.save).toHaveBeenCalledWith(mockConcert);
    });
  });

  describe('getAllConcerts', () => {
    it('should return all concerts with reservations', async () => {
      const mockConcerts = [
        {
          id: '1',
          name: 'Concert 1',
          description: 'Description 1',
          seats: 100,
          reservations: [],
        },
        {
          id: '2',
          name: 'Concert 2',
          description: 'Description 2',
          seats: 200,
          reservations: [],
        },
      ];

      (mockConcertRepository.find as jest.Mock).mockResolvedValue(mockConcerts);

      const result = await service.getAllConcerts();

      expect(result).toBe(mockConcerts);
      expect(mockConcertRepository.find).toHaveBeenCalledWith({
        relations: ['reservations'],
      });
    });

    it('should return empty array when no concerts exist', async () => {
      (mockConcertRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.getAllConcerts();

      expect(result).toEqual([]);
    });
  });

  describe('deleteConcert', () => {
    it('should delete a concert if it exists', async () => {
      const mockConcert = {
        id: '1',
        name: 'Test Concert',
        description: 'Test Description',
        seats: 100,
        reservations: [],
      };

      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(
        mockConcert,
      );
      (mockConcertRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteConcert('1');

      expect(mockConcertRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['reservations'],
      });
      expect(mockConcertRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if concert does not exist', async () => {
      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(null);

      try {
        await service.deleteConcert('1');
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        const notFoundError = error as NotFoundException;
        expect(notFoundError.getResponse()).toEqual({
          code: 'CONCERT_NOT_FOUND',
          message: 'Concert not found',
        });
      }
    });

    it('should throw BadRequestException with CONCERT_HAS_RESERVATIONS code if concert has reservations', async () => {
      const mockConcert = {
        id: '1',
        name: 'Test Concert',
        description: 'Test Description',
        seats: 100,
        reservations: [{ id: '1', status: 'confirmed' }],
      };

      (mockConcertRepository.findOne as jest.Mock).mockResolvedValue(
        mockConcert,
      );

      try {
        await service.deleteConcert('1');
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const badRequestError = error as BadRequestException;
        expect(badRequestError.getResponse()).toEqual({
          code: 'CONCERT_HAS_RESERVATIONS',
          message: 'Cannot delete concert with existing reservations',
        });
      }

      expect(mockConcertRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['reservations'],
      });
      expect(mockConcertRepository.delete).not.toHaveBeenCalled();
    });
  });
});
