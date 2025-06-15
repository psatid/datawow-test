import { useQuery } from "@tanstack/react-query";
import { getHistory } from "./history-services";

export const useGetHistory = () => {
  return useQuery({
    queryKey: ["GET_HISTORY"],
    queryFn: async () => {
      return await getHistory();
    },
  });
};
