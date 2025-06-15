import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationStatus } from './reservation.entity';

describe('ReservationsController', () => {
  let controller: ReservationsController;

  const mockReservationsService = {
    getUserReservations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserReservations', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return an array of user reservations', async () => {
      const userEmail = 'test@example.com';
      const mockReservations = [
        {
          id: '1',
          customerEmail: userEmail,
          status: ReservationStatus.CONFIRMED,
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

      mockReservationsService.getUserReservations.mockResolvedValue(
        mockReservations,
      );

      const result = await controller.getUserReservations(userEmail);
      expect(result[0].concertId).toBe('1');
      expect(result[0].status).toBe(ReservationStatus.CONFIRMED);
      expect(mockReservationsService.getUserReservations).toHaveBeenCalledWith(
        userEmail,
      );
    });

    it('should throw BadRequestException if email is empty', async () => {
      const emptyEmail = '';

      try {
        await controller.getUserReservations(emptyEmail);
        fail('Should have thrown BadRequestException');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(BadRequestException);
        const badRequestError = error as BadRequestException;
        expect(badRequestError.getResponse()).toEqual({
          code: 'EMAIL_NOT_PROVIDED',
          message: 'Email query parameter is required.',
        });
        expect(
          mockReservationsService.getUserReservations,
        ).not.toHaveBeenCalled();
      }
    });
  });
});
