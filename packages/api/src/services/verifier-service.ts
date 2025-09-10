import {
  type PublicClient,
  type WalletClient,
  type Address,
  type Hash,
  decodeErrorResult,
} from "viem";
import { CHAIN_BY_ENV, EXECUTION_VERIFIER_ABI } from "../constants";
import env from "@/env";

/**
 * Parses contract errors using Viem's decodeErrorResult
 */
function parseContractError(error: unknown): string {
  try {
    // Check if error has cause property with ContractFunctionRevertedError
    if (error && typeof error === "object" && "cause" in error && error.cause) {
      const cause = error.cause as any;

      // Check if cause has raw property (the raw error data)
      if (cause && typeof cause === "object" && "raw" in cause && cause.raw) {
        try {
          // Use Viem's decodeErrorResult with the raw data
          const decodedError = decodeErrorResult({
            abi: EXECUTION_VERIFIER_ABI,
            data: cause.raw as `0x${string}`,
          });

          switch (decodedError.errorName) {
            case "AccessControlUnauthorizedAccount":
              const account = decodedError.args?.[0] as Address;
              const neededRole = decodedError.args?.[1] as string;
              return `Access denied: The account ${account} does not have the required role`;

            case "AccessControlBadConfirmation":
              return "Access denied: Invalid confirmation for role management.";

            case "ArraysLengthMismatch":
              return "Transaction failed: Array length mismatch. Please ensure all arrays have the same length.";

            case "BatchSizeTooLarge":
              const size = decodedError.args?.[0] as bigint;
              const maxSize = decodedError.args?.[1] as bigint;
              return `Transaction failed: Batch size ${size} exceeds maximum allowed size of ${maxSize}.`;

            case "CannotRevokeFromAdmin":
              return "Access denied: Cannot revoke role from admin account.";

            case "CannotRevokeFromSelf":
              return "Access denied: Cannot revoke role from self.";

            case "HashAlreadyStored":
              const hash = decodedError.args?.[0] as string;
              return `Transaction failed: Hash has already been stored.`;

            case "InvalidUserAddress":
              const userAddress = decodedError.args?.[0] as Address;
              return `Transaction failed: Invalid user address ${userAddress}.`;

            default:
              return `Transaction failed: ${decodedError.errorName} - ${decodedError.args ? JSON.stringify(decodedError.args) : "Unknown error"}`;
          }
        } catch (decodeError) {
          // If ABI decoding fails, fall back to string parsing
          console.warn("Failed to decode error with ABI:", decodeError);
        }
      }
    }

    // Fallback to string parsing for non-contract errors
    const errorString = String(error);

    // Gas estimation errors
    if (errorString.includes("gas") || errorString.includes("Gas")) {
      return "Transaction failed: Gas estimation error. The transaction may fail or require more gas than estimated.";
    }

    // Network errors
    if (errorString.includes("network") || errorString.includes("Network")) {
      return "Network error: Unable to connect to the blockchain network. Please check your connection and try again.";
    }

    // Insufficient funds
    if (errorString.includes("insufficient") || errorString.includes("Insufficient")) {
      return "Transaction failed: Insufficient funds to complete the transaction.";
    }

    // Nonce errors
    if (errorString.includes("nonce") || errorString.includes("Nonce")) {
      return "Transaction failed: Nonce error. Please try again in a moment.";
    }

    // Contract function reverted (fallback)
    if (errorString.includes("reverted")) {
      return "Transaction failed: The contract function reverted. This could be due to insufficient permissions, invalid parameters, or contract state issues.";
    }

    // Default fallback
    return `Transaction failed: ${errorString}`;
  } catch (parseError) {
    // If all parsing fails, return the original error
    return `Transaction failed: ${String(error)}`;
  }
}

interface VerifierServiceConfig {
  contractAddress: Address;
  publicClient: PublicClient;
  walletClient: WalletClient;
}

interface StoreHashParams {
  hash: Hash;
  userAddress: Address;
}

interface StoreHashBatchParams {
  hashes: Hash[];
  userAddress: Address;
}

interface RoleManagementParams {
  addresses: Address[];
}

const chain = CHAIN_BY_ENV[env.NODE_ENV];

export class VerifierService {
  private contractAddress: Address;
  private publicClient: PublicClient;
  private walletClient: WalletClient;

  constructor(config: VerifierServiceConfig) {
    this.contractAddress = config.contractAddress;
    this.publicClient = config.publicClient;
    this.walletClient = config.walletClient;
  }

  /**
   * Stores a single hash with user address
   */
  async storeHash(params: StoreHashParams): Promise<Hash> {
    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: EXECUTION_VERIFIER_ABI,
        functionName: "storeHash",
        args: [params.hash, params.userAddress],
        chain: chain,
        account: this.walletClient.account!,
      });
      return hash;
    } catch (error) {
      const parsedError = parseContractError(error);
      throw new Error(`Failed to store hash: ${parsedError}`);
    }
  }

  /**
   * Stores multiple hashes in batch
   */
  async storeHashBatch(params: StoreHashBatchParams): Promise<Hash> {
    try {
      // Validate batch size
      if (params.hashes.length > 20) {
        throw new Error("Batch size cannot exceed 20 elements");
      }

      if (!params.userAddress) {
        throw new Error("User address is required");
      }

      const hash = await (this.walletClient.writeContract as any)({
        address: this.contractAddress,
        abi: EXECUTION_VERIFIER_ABI,
        functionName: "storeHashBatch",
        args: [params.hashes, params.userAddress],
      });
      return hash;
    } catch (error) {
      const parsedError = parseContractError(error);
      throw new Error(`${parsedError}`);
    }
  }

  /**
   * Checks if a hash is stored
   */
  async isHashStored(hash: Hash): Promise<Address> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: EXECUTION_VERIFIER_ABI,
        functionName: "isStored",
        args: [hash],
      });
      return result as Address;
    } catch (error) {
      const parsedError = parseContractError(error);
      throw new Error(`Failed to check if hash is stored: ${parsedError}`);
    }
  }

  /**
   * Grants STORE_ROLE to multiple addresses
   */
  async grantStoreRoleBatch(params: RoleManagementParams): Promise<Hash> {
    try {
      if (params.addresses.length > 20) {
        throw new Error("Batch size cannot exceed 20 elements");
      }

      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: EXECUTION_VERIFIER_ABI,
        functionName: "grantStoreRoleBatch",
        args: [params.addresses],
        chain: chain,
        account: this.walletClient.account!,
      });
      return hash;
    } catch (error) {
      const parsedError = parseContractError(error);
      throw new Error(`Failed to grant store roles: ${parsedError}`);
    }
  }

  /**
   * Revokes STORE_ROLE from multiple addresses
   */
  async revokeStoreRoleBatch(params: RoleManagementParams): Promise<Hash> {
    try {
      if (params.addresses.length > 20) {
        throw new Error("Batch size cannot exceed 20 elements");
      }

      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: EXECUTION_VERIFIER_ABI,
        functionName: "revokeStoreRoleBatch",
        args: [params.addresses],
        chain: chain,
        account: this.walletClient.account!,
      });
      return hash;
    } catch (error) {
      const parsedError = parseContractError(error);
      throw new Error(`Failed to revoke store roles: ${parsedError}`);
    }
  }

  /**
   * Checks if multiple addresses have STORE_ROLE
   */
  async hasStoreRoleBatch(addresses: Address[]): Promise<boolean[]> {
    try {
      if (addresses.length > 20) {
        throw new Error("Batch size cannot exceed 20 elements");
      }

      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: EXECUTION_VERIFIER_ABI,
        functionName: "hasStoreRoleBatch",
        args: [addresses],
      });
      return result as boolean[];
    } catch (error) {
      const parsedError = parseContractError(error);
      throw new Error(`Failed to check store roles: ${parsedError}`);
    }
  }

  /**
   * Gets contract constants
   */
  async getConstants() {
    try {
      const [storeRole, maxBatchSize] = await Promise.all([
        this.publicClient.readContract({
          address: this.contractAddress,
          abi: EXECUTION_VERIFIER_ABI,
          functionName: "STORE_ROLE",
          args: [],
        }),
        this.publicClient.readContract({
          address: this.contractAddress,
          abi: EXECUTION_VERIFIER_ABI,
          functionName: "MAX_BATCH_SIZE",
          args: [],
        }),
      ]);

      return {
        storeRole: storeRole as string,
        maxBatchSize: maxBatchSize as bigint,
      };
    } catch (error) {
      const parsedError = parseContractError(error);
      throw new Error(`Failed to get constants: ${parsedError}`);
    }
  }

  /**
   * Gets contract address
   */
  getContractAddress(): Address {
    return this.contractAddress;
  }
}
