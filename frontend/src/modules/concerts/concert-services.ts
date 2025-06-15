import axios from "axios";

const CONCERT_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_DOMAIN}/v1/concerts`;

type GetConcertsResponse = {
  id: string;
  name: string;
  description: string;
  seats: number;
};

export const getConcerts = async () => {
  const response = await axios.get<GetConcertsResponse[]>(CONCERT_API_BASE_URL);
  return response.data;
};

export type CreateConcertRequest = {
  name: string;
  description: string;
  seats: number;
};

export const createConcert = async (request: CreateConcertRequest) => {
  return await axios.post(CONCERT_API_BASE_URL, request);
};

export const deleteConcert = async (concertId: string) => {
  return await axios.delete(`${CONCERT_API_BASE_URL}/${concertId}`);
};

export const reserveSeats = async (concertId: string, email: string) => {
  return await axios.post(`${CONCERT_API_BASE_URL}/${concertId}/reserve`, {
    email,
  });
};

export const cancelReservation = async (concertId: string, email: string) => {
  return await axios.put(`${CONCERT_API_BASE_URL}/${concertId}/cancel`, {
    email,
  });
};
