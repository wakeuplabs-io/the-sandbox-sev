import { Chain, polygon, polygonAmoy } from 'viem/chains';

export * from './execution-verifier'

export const CHAIN_BY_ENV: Record<string, Chain> = {
 development: polygonAmoy,
 production: polygon,
 staging: polygonAmoy,
};