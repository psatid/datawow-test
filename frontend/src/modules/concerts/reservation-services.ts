import axios from "axios";

const RESERVATIONS_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_DOMAIN}/v1/reservations`;

type GetUserReservationResponse = {
  id: string;
  concertId: string;
  status: string;
};

export const getUserReservations = async (email: string) => {
  const response = await axios.get<GetUserReservationResponse[]>(
    RESERVATIONS_API_BASE_URL,
    {
      params: { email },
    }
  );
  return response.data;
};
