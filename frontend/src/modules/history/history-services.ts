import axios from "axios";

const TRANSACTIONS_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_DOMAIN}/v1/transactions`;

type GetHistoryReponse = {
  id: string;
  date: string;
  userEmail: string;
  type: string;
  concertName: string;
};

export const getHistory = async () => {
  const response = await axios.get<GetHistoryReponse[]>(
    TRANSACTIONS_API_BASE_URL
  );
  return response.data;
};
