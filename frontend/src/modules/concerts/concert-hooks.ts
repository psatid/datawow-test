import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { CONCERT_QUERY_KEY } from "./concert-constants";
import {
  createConcert,
  CreateConcertRequest,
  deleteConcert,
  getConcerts,
} from "./concert-services";

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
      }

      alert(`Error deleting concert: ${error.message}`);
    },
  });
};
