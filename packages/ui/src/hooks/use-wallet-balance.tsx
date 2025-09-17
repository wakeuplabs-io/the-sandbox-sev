import { useQuery } from "@tanstack/react-query";
import { useWalletService } from "./use-wallet-service";
import { UserRoleEnum } from "@/shared/constants";
import { useGetUser } from "./use-get-user";
import { useWeb3Auth } from "@/context/web3auth";

export function useWalletBalance() {
  const { account, email } = useWeb3Auth(); 
  const { user } = useGetUser(account || "", email || "");
  const walletService = useWalletService();

  const { data, isLoading } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: () => walletService.getWalletBalance(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    enabled: !!user && [UserRoleEnum.ADMIN, UserRoleEnum.CONSULTANT].includes(user.role),
  });

  const balanceStatus = data?.balanceStatus;
  const balance = data?.balanceEth;
  const address = data?.address;
  const network = data?.network;

  const balanceColor = isLoading
    ? "text-gray-400"
    : balanceStatus === "sufficient"
      ? "text-green-400"
      : balanceStatus === "warning"
        ? "text-yellow-400"
        : "text-red-400";

  const shouldBlockActions = balance && balance < 0.2;

  return {
    ...data,
    balance,
    address,
    network,
    balanceColor,
    shouldBlockActions,
    balanceStatus,
    isLoading,
  };
}
