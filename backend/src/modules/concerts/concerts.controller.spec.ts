import { Test, TestingModule } from '@nestjs/testing';
import {
  CancelReservationDto,
  CreateReservationDto,
} from '../reservations/dto/reservation.dto';
import {
  Reservation,
  ReservationStatus,
} from '../reservations/reservation.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { GetConcertResponseDto } from './dto/concert-resopnse.dto';
import { CreateConcertDto } from './dto/create-concert.dto';

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
        const mockConcerts = [
          {
            id: '1',
            name: 'Concert 1',
            description: 'Description 1',
            seats: 100,
            reservations: [],
            transactions: [],
            createdAt: new Date('2025-06-15T11:05:59.850Z'),
            updatedAt: new Date('2025-06-15T11:05:59.850Z'),
          },
          {
            id: '2',
            name: 'Concert 2',
            description: 'Description 2',
            seats: 200,
            reservations: [],
            transactions: [],
            createdAt: new Date('2025-06-15T11:05:59.850Z'),
            updatedAt: new Date('2025-06-15T11:05:59.850Z'),
          },
        ];

        const expectedResponse: GetConcertResponseDto = {
          concerts: mockConcerts.map((concert) => ({
            id: concert.id,
            name: concert.name,
            description: concert.description,
            seats: concert.seats,
            availableSeats: concert.seats,
          })),
          totalSeats: 300,
          totalConfirmedReservations: 0,
          totalCancelledReservations: 0,
        };

        jest
          .spyOn(mockConcertsService, 'getAllConcerts')
          .mockResolvedValue(mockConcerts);

        const result = await controller.getAllConcerts();

        expect(result).toEqual(expectedResponse);
        expect(mockConcertsService.getAllConcerts).toHaveBeenCalled();
      });

      it('should calculate stats correctly when concerts have reservations', async () => {
        const mockConcert1 = {
          id: '1',
          name: 'Concert 1',
          description: 'Description 1',
          seats: 100,
          reservations: [],
          transactions: [],
          createdAt: new Date('2025-06-15T11:05:59.850Z'),
          updatedAt: new Date('2025-06-15T11:05:59.850Z'),
        };

        const mockConcert2 = {
          id: '2',
          name: 'Concert 2',
          description: 'Description 2',
          seats: 200,
          reservations: [],
          transactions: [],
          createdAt: new Date('2025-06-15T11:05:59.850Z'),
          updatedAt: new Date('2025-06-15T11:05:59.850Z'),
        };

        const mockConcerts = [
          {
            ...mockConcert1,
            reservations: [
              {
                id: '1',
                status: ReservationStatus.CONFIRMED,
                customerEmail: 'test1@example.com',
                concert: mockConcert1,
                createdAt: new Date('2025-06-15T11:05:59.850Z'),
                updatedAt: new Date('2025-06-15T11:05:59.850Z'),
              },
              {
                id: '2',
                status: ReservationStatus.CONFIRMED,
                customerEmail: 'test2@example.com',
                concert: mockConcert1,
                createdAt: new Date('2025-06-15T11:05:59.850Z'),
                updatedAt: new Date('2025-06-15T11:05:59.850Z'),
              },
              {
                id: '3',
                status: ReservationStatus.CANCELLED,
                customerEmail: 'test3@example.com',
                concert: mockConcert1,
                createdAt: new Date('2025-06-15T11:05:59.850Z'),
                updatedAt: new Date('2025-06-15T11:05:59.850Z'),
              },
            ],
          },
          {
            ...mockConcert2,
            reservations: [
              {
                id: '4',
                status: ReservationStatus.CONFIRMED,
                customerEmail: 'test4@example.com',
                concert: mockConcert2,
                createdAt: new Date('2025-06-15T11:05:59.850Z'),
                updatedAt: new Date('2025-06-15T11:05:59.850Z'),
              },
              {
                id: '5',
                status: ReservationStatus.CANCELLED,
                customerEmail: 'test5@example.com',
                concert: mockConcert2,
                createdAt: new Date('2025-06-15T11:05:59.850Z'),
                updatedAt: new Date('2025-06-15T11:05:59.850Z'),
              },
              {
                id: '6',
                status: ReservationStatus.CANCELLED,
                customerEmail: 'test6@example.com',
                concert: mockConcert2,
                createdAt: new Date('2025-06-15T11:05:59.850Z'),
                updatedAt: new Date('2025-06-15T11:05:59.850Z'),
              },
            ],
          },
        ];

        const expectedResponse: GetConcertResponseDto = {
          concerts: [
            {
              id: '1',
              name: 'Concert 1',
              description: 'Description 1',
              seats: 100,
              availableSeats: 98, // 100 seats - 2 confirmed reservations
            },
            {
              id: '2',
              name: 'Concert 2',
              description: 'Description 2',
              seats: 200,
              availableSeats: 199, // 200 seats - 1 confirmed reservation
            },
          ],
          totalSeats: 300, // 100 + 200
          totalConfirmedReservations: 3, // 2 + 1
          totalCancelledReservations: 3, // 1 + 2
        };

        jest
          .spyOn(mockConcertsService, 'getAllConcerts')
          .mockResolvedValue(mockConcerts);

        const result = await controller.getAllConcerts();

        expect(result).toEqual(expectedResponse);
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
