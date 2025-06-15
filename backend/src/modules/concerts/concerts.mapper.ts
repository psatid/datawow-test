import { ReservationStatus } from '../reservations/reservation.entity';
import { Concert } from './concert.entity';
import { GetConcertResponseDto } from './dto/concert-resopnse.dto';

export const mapConcertEntityToGetConcertResponseDto = (
  concerts: Concert[],
): GetConcertResponseDto => {
  return {
    concerts: concerts.map((concert) => ({
      id: concert.id,
      name: concert.name,
      description: concert.description,
      seats: concert.seats,
      availableSeats:
        concert.seats -
        (concert.reservations?.filter(
          (reservation) => reservation.status === ReservationStatus.CONFIRMED,
        ).length || 0),
    })),
    totalSeats: concerts.reduce((total, concert) => total + concert.seats, 0),
    totalConfirmedReservations: concerts.reduce(
      (total, concert) =>
        total +
        (concert.reservations?.filter(
          (reservation) => reservation.status === ReservationStatus.CONFIRMED,
        ).length || 0),
      0,
    ),
    totalCancelledReservations: concerts.reduce(
      (total, concert) =>
        total +
        (concert.reservations?.filter(
          (reservation) => reservation.status === ReservationStatus.CANCELLED,
        ).length || 0),
      0,
    ),
  };
};
