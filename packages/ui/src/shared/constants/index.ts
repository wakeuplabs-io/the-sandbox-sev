import { arbitrum, arbitrumSepolia, Chain } from "viem/chains";

export enum PlayerStatusEnum {
  INACTIVE,
  ACTIVE,
  REDEEM,
}

export enum UserRoleEnum {
  ADMIN = "ADMIN",
  USER = "USER",
}

export const ETHERSCAN_BY_CHAIN_ID: Record<number, string> = {
  //arbitrum mainnet
  42161: "https://arbiscan.io",
  //arbitrum sepolia
  421614: "https://sepolia.arbiscan.io",
};

export const CHAIN_BY_ENV: Record<string, Chain> = {
  development: arbitrumSepolia,
  production: arbitrum,
  staging: arbitrumSepolia,
};
