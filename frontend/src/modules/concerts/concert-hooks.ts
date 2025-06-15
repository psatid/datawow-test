import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { CONCERT_QUERY_KEY } from "./concert-constants";
import {
  cancelReservation,
  createConcert,
  CreateConcertRequest,
  deleteConcert,
  getConcerts,
  reserveSeats,
} from "./concert-services";
import { getUserReservations } from "./reservation-services";

const getUserEmail = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("userEmail") || "";
};

export const useGetConcerts = () => {
  return useQuery({
    queryKey: [CONCERT_QUERY_KEY.GET_CONCERTS],
    queryFn: async () => {
      return await getConcerts();
    },
  });
};

type UseCreateConcertParams = {
  onSuccess?: () => void;
};

export const useCreateConcert = ({
  onSuccess,
}: UseCreateConcertParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateConcertRequest) => {
      return await createConcert(request);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: [CONCERT_QUERY_KEY.GET_CONCERTS],
      });
    },
    onError: (error: Error) => {
      if (isAxiosError(error)) {
        const errorResponse = error.response;
        alert(`Error creating concert: ${errorResponse?.data.message}`);
        return;
      }
      alert(`Error creating concert: ${error.message}`);
    },
  });
};

type UseDeleteConcertParams = {
  onSuccess?: () => void;
};

export const useDeleteConcert = ({
  onSuccess,
}: UseDeleteConcertParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (concertId: string) => {
      return await deleteConcert(concertId);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: [CONCERT_QUERY_KEY.GET_CONCERTS],
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorResponse = error.response;
        if (errorResponse?.data.code === "CONCERT_HAS_RESERVATIONS") {
          alert("Cannot delete concert with existing reservations.");
          return;
        }
        alert(`Error deleting concert: ${errorResponse?.data.message}`);
      }
      alert(`Error deleting concert: ${error.message}`);
    },
  });
};

export const useGetUserConcertsList = () => {
  const email = getUserEmail();
  return useQuery({
    queryKey: [CONCERT_QUERY_KEY.GET_USER_CONCERTS, email],
    queryFn: async () => {
      const response = await getConcerts();
      const userReservaton = await getUserReservations(email);
      return response.concerts.map((concert) => ({
        ...concert,
        isReserved: userReservaton.some(
          (reservation) =>
            reservation.concertId === concert.id &&
            reservation.status === "confirmed"
        ),
      }));
    },
    enabled: !!email,
  });
};

export const useReserveConcert = (concertId: string) => {
  const email = getUserEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await reserveSeats(concertId, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONCERT_QUERY_KEY.GET_USER_CONCERTS, email],
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorResponse = error.response;
        if (errorResponse?.data.code === "NO_SEATS_AVAILABLE") {
          alert("Concert is fully booked.");
          return;
        }
        alert(`Error deleting concert: ${errorResponse?.data.message}`);
      }
      alert(`Error reserving concert: ${error.message}`);
    },
  });
};

export const useCancelConcertReservation = (concertId: string) => {
  const email = getUserEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await cancelReservation(concertId, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONCERT_QUERY_KEY.GET_USER_CONCERTS, email],
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorResponse = error.response;
        alert(`Error cancelling reservation: ${errorResponse?.data.message}`);
        return;
      }
      alert(`Error cancelling reservation: ${error.message}`);
    },
  });
};
