import { Chain, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import env from "../lib/env";

export const getPublicHttpsClient = (chain: Chain = arbitrumSepolia) => {
  const publicClient = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });

  return publicClient;
};

export const getWalletHttpsClient = (chain: Chain = arbitrumSepolia) => {
  const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(env.RPC_URL),
  });

  return walletClient;
};
