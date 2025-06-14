import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { ReservationsService } from '../reservations/reservations.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import {
  CreateReservationDto,
  CancelReservationDto,
} from '../reservations/dto/reservation.dto';
import { Concert } from './concert.entity';
import {
  Reservation,
  ReservationStatus,
} from '../reservations/reservation.entity';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let mockConcertsService: Partial<ConcertsService>;
  let mockReservationsService: Partial<ReservationsService>;

  beforeEach(async () => {
    mockConcertsService = {
      createConcert: jest.fn(),
      getAllConcerts: jest.fn(),
      deleteConcert: jest.fn(),
    };

    mockReservationsService = {
      reserveSeat: jest.fn(),
      cancelReservation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Admin Endpoints', () => {
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

        (mockConcertsService.createConcert as jest.Mock).mockResolvedValue(
          mockConcert,
        );

        const result = await controller.createConcert(createConcertDto);

        expect(result).toBe(mockConcert);
        expect(mockConcertsService.createConcert).toHaveBeenCalledWith(
          createConcertDto,
        );
      });
    });

    describe('deleteConcert', () => {
      it('should delete a concert', async () => {
        const concertId = '1';

        await controller.deleteConcert(concertId);

        expect(mockConcertsService.deleteConcert).toHaveBeenCalledWith(
          concertId,
        );
      });
    });
  });

  describe('User Endpoints', () => {
    describe('getAllConcerts', () => {
      it('should return all concerts', async () => {
        const mockConcerts: Concert[] = [
          {
            id: '1',
            name: 'Concert 1',
            description: 'Description 1',
            seats: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            reservations: [],
            transactions: [],
          },
          {
            id: '2',
            name: 'Concert 2',
            description: 'Description 2',
            seats: 200,
            createdAt: new Date(),
            updatedAt: new Date(),
            reservations: [],
            transactions: [],
          },
        ];

        (mockConcertsService.getAllConcerts as jest.Mock).mockResolvedValue(
          mockConcerts,
        );

        const result = await controller.getAllConcerts();

        expect(result).toBe(mockConcerts);
        expect(mockConcertsService.getAllConcerts).toHaveBeenCalled();
      });
    });

    describe('reserveSeat', () => {
      it('should reserve a seat for a concert', async () => {
        const concertId = '1';
        const createReservationDto: CreateReservationDto = {
          customerEmail: 'test@example.com',
        };
        const mockReservation: Partial<Reservation> = {
          id: '1',
          customerEmail: createReservationDto.customerEmail,
          status: ReservationStatus.CONFIRMED,
        };

        (mockReservationsService.reserveSeat as jest.Mock).mockResolvedValue(
          mockReservation,
        );

        const result = await controller.reserveSeat(
          concertId,
          createReservationDto,
        );

        expect(result).toBe(mockReservation);
        expect(mockReservationsService.reserveSeat).toHaveBeenCalledWith(
          concertId,
          createReservationDto.customerEmail,
        );
      });
    });

    describe('cancelReservation', () => {
      it('should cancel a reservation', async () => {
        const concertId = '1';
        const cancelReservationDto: CancelReservationDto = {
          customerEmail: 'test@example.com',
        };

        await controller.cancelReservation(concertId, cancelReservationDto);

        expect(mockReservationsService.cancelReservation).toHaveBeenCalledWith(
          concertId,
          cancelReservationDto.customerEmail,
        );
      });
    });
  });
});
