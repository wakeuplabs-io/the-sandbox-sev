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
  VAULT = "VAULT",
}

export enum TaskStateEnum {
  STORED = "STORED",
  EXECUTED = "EXECUTED",
  BLOCKED = "BLOCKED",
  CANCELLED = "CANCELLED",
}

export enum TaskStateLabelEnum {
  STORED = "Pending",
  EXECUTED = "Executed",
  BLOCKED = "Blocked",
  CANCELLED = "Cancelled",
}

export enum TaskPriorityEnum {
  SUPER_HIGH = "Super-High",
  HIGH = "High",
  HIGH_24H = "High 24h",
  MEDIUM = "Medium",
  MEDIUM_48H = "Medium 48h",
  LOW = "Low",
  LOW_72H = "Low 72h",
}

export enum TaskPriorityLabelEnum {
  SUPER_HIGH = "Super High",
  HIGH = "High",
  HIGH_24H = "High 24h",
  MEDIUM = "Medium",
  MEDIUM_48H = "Medium 48h",
  LOW = "Low",
  LOW_72H = "Low 72h",
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

export const W3A_CHAINS_BY_ENV: Record<string, string> = {
  development: "sapphire_devnet",
  production: "sapphire_mainnet",
  staging: "sapphire_devnet",
};
