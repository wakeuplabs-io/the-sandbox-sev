import { type PublicClient, type WalletClient, type Address, type Hash } from "viem";
import { CHAIN_BY_ENV, EXECUTION_VERIFIER_ABI } from "../constants";
import env from "@/env";

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
      throw new Error(`Failed to store hash: ${error}`);
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
     
      if(!params.userAddress) {
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
      throw new Error(`Failed to store hash batch: ${error}`);
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
      throw new Error(`Failed to check if hash is stored: ${error}`);
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
      throw new Error(`Failed to grant store roles: ${error}`);
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
      throw new Error(`Failed to revoke store roles: ${error}`);
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
      throw new Error(`Failed to check store roles: ${error}`);
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
      throw new Error(`Failed to get constants: ${error}`);
    }
  }

  /**
   * Gets contract address
   */
  getContractAddress(): Address {
    return this.contractAddress;
  }
}
