import { useQuery } from "@tanstack/react-query";
import { useUser } from "./use-user";
import { useWeb3Auth } from "@/context/web3auth";
import { User, PaginationInfo } from "@/domain/admin/users/types";

export const useGetUsers = (page: number = 1, limit: number = 10) => {
  const { getUsers } = useUser();
  const { isAuthenticated } = useWeb3Auth();
  const query = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getUsers(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!isAuthenticated,
  });

  const data = query.data as { users: User[]; pagination: PaginationInfo } | undefined;

  return {
    users: data?.users || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};