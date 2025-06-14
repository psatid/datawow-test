import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';

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
      const email = 'test@example.com';
      const mockReservations: Partial<Reservation>[] = [
        {
          id: '1',
          customerEmail: email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          customerEmail: email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockReservationsService.getUserReservations.mockResolvedValue(
        mockReservations,
      );

      const result = await controller.getUserReservations(email);

      expect(result).toEqual(mockReservations);
      expect(mockReservationsService.getUserReservations).toHaveBeenCalledWith(
        email,
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
