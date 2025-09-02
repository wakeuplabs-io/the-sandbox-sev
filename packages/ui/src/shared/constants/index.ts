import { Chain, polygon, polygonAmoy } from "viem/chains";

export enum UserRoleEnum {
  ADMIN = "ADMIN",
  CONSULTANT = "CONSULTANT",
  MEMBER = "MEMBER",
}

export enum TaskTypeEnum {
  LIQUIDATION = "LIQUIDATION",
  ACQUISITION = "ACQUISITION",
  AUTHORIZATION = "AUTHORIZATION",
  ARBITRAGE = "ARBITRAGE",
}


export const ETHERSCAN_BY_CHAIN_ID: Record<number, string> = {
  //arbitrum mainnet
  42161: "https://arbiscan.io",
  //arbitrum sepolia
  421614: "https://sepolia.arbiscan.io",
  //polygon amoy
  80002: "https://amoy.polygonscan.com/",
  //polygon mainnet
  137: "https://polygonscan.com",
};

export const CHAIN_BY_ENV: Record<string, Chain> = {
  development: polygonAmoy,
  production: polygon,
  staging: polygonAmoy,
};
