import env from "@/env";
import { Chain, createPublicClient, createWalletClient, http, type PublicClient, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";

export const getPublicHttpsClient = (chain: Chain = polygonAmoy): PublicClient => {
  const publicClient = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });

  return publicClient;
};

export const getWalletHttpsClient = (chain: Chain = polygonAmoy): WalletClient => {
  const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(env.RPC_URL),
  });

  return walletClient;
};
