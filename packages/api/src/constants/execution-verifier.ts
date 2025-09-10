import executionVerifierAbi from './execution-verifier-abi.json'

// Contract ABI
export const EXECUTION_VERIFIER_ABI = executionVerifierAbi.abi

// Contract constants
export const STORE_ROLE = '0x9cf888df9829983a4501c3e5076732bbf523e06c6b31f6ce065f61c2aec20567'
export const MAX_BATCH_SIZE = 20

// Type exports
export type ExecutionVerifierABI = typeof EXECUTION_VERIFIER_ABI
