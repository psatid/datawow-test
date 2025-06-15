type ConcertResponseDto = {
  id: string;
  name: string;
  description: string;
  seats: number;
};

export class GetConcertResponseDto {
  concerts: ConcertResponseDto[];
  totalSeats: number;
  totalConfirmedReservations: number;
  totalCancelledReservations: number;
}

export class UserConcertResponseDto {
  id: string;
  name: string;
  description: string;
  availableSeats: number;
  isReserved: boolean;
}
