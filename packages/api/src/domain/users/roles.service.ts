import prisma from "@/lib/prisma";
import { VerifierService } from "../../services/verifier-service";
import { getPublicHttpsClient, getWalletHttpsClient } from "../../services";
import { CHAIN_BY_ENV } from "../../constants";
import env from "@/env";
import type { BulkRoleAssignment } from "./roles.schema";
import { Role } from "@/generated/prisma";
import type { Address } from "viem";

// Initialize services
const chain = CHAIN_BY_ENV[env.NODE_ENV];
const contractAddress = env.EXECUTION_VERIFIER_ADDRESS as `0x${string}`;

const publicClient = getPublicHttpsClient(chain);
const walletClient = getWalletHttpsClient(chain);

const verifierService = new VerifierService({
  contractAddress,
  publicClient,
  walletClient,
});

/**
 * Assigns roles to multiple users
 */
export const assignRoles = async (data: BulkRoleAssignment) => {
  try {
    const results = [];

    for (const assignment of data.assignments) {
      const { userId, role } = assignment;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Update role in database
      await prisma.user.update({
        where: { id: userId },
        data: { role }
      });

      // Handle smart contract role
      const userAddress = user.address as Address;
      
      if (role === Role.MEMBER) {
        // Remove STORE_ROLE from contract
        await verifierService.revokeStoreRoleBatch({
          addresses: [userAddress]
        });
        results.push({ userId, role, action: 'removed from contract' });
      } else {
        // Grant STORE_ROLE to contract (for ADMIN, CONSULTANT, etc.)
        await verifierService.grantStoreRoleBatch({
          addresses: [userAddress]
        });
        results.push({ userId, role, action: 'granted to contract' });
      }
    }

    return {
      success: true,
      message: 'All roles assigned successfully',
      details: results,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to assign roles: ${error}`);
  }
};