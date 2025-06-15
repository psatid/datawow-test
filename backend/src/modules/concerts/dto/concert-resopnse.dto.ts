type ConcertResponseDto = {
  id: string;
  name: string;
  description: string;
  seats: number;
  availableSeats: number;
};

export class GetConcertResponseDto {
  concerts: ConcertResponseDto[];
  totalSeats: number;
  totalConfirmedReservations: number;
  totalCancelledReservations: number;
}
