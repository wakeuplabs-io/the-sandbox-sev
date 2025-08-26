import { useQuery } from "@tanstack/react-query";
import { useUser } from "./use-user";

export const useGetUser = (address: string, email?: string) => {
  const { getByAddress } = useUser();

  const query = useQuery({
    queryKey: ["user", address, email],
    queryFn: () => getByAddress(address, email),
    enabled: !!address,
  });
  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};