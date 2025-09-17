import { CHAIN_BY_ENV } from "@/constants";
import { getPublicHttpsClient, getWalletHttpsClient } from "@/services/wallet-clients";
import { formatEther } from "viem";
import env from "@/env";

export const getWalletBalance = async () => {
  try {
    const publicClient = getPublicHttpsClient();
    const walletClient = getWalletHttpsClient();

    const address = walletClient.account?.address;
    const balanceWei = await publicClient.getBalance({ address: address as `0x${string}` });
    const balanceEth = parseFloat(formatEther(balanceWei));
    const chain = CHAIN_BY_ENV[env.NODE_ENV];

    const balanceStatus = balanceEth >= 0.5 ? "sufficient" : balanceEth >= 0.2 ? "warning" : "critical";
    return {
      address,
      balanceWei: balanceWei.toString(),
      balanceEth,
      balanceStatus,
      network: {
        id: chain.id,
        name: chain.name,
        nativeCurrency: {
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol,
          decimals: chain.nativeCurrency.decimals,
        },
        blockExplorers: chain.blockExplorers,
        rpcUrls: chain.rpcUrls,
      },
    };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Unknown error occurred while fetching wallet balance");
  }
};
