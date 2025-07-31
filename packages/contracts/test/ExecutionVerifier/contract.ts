import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("ExecutionVerifier", function () {
  async function deployExecutionVerifierFixture() {
    const [admin, user1] = await hre.viem.getWalletClients();

    const executionVerifier = await hre.viem.deployContract("ExecutionVerifier", []);

    return {
      executionVerifier,
      admin,
      user1,
    };
  }

  describe("Constructor", function () {
    it("Should set the deployer as admin", async function () {
      const { executionVerifier, admin } = await loadFixture(deployExecutionVerifierFixture);

      const hasAdminRole = await executionVerifier.read.hasRole([
        await executionVerifier.read.DEFAULT_ADMIN_ROLE(),
        admin.account.address,
      ]);

      expect(hasAdminRole).to.be.true;
    });

    it("Should grant STORE_ROLE to deployer", async function () {
      const { executionVerifier, admin } = await loadFixture(deployExecutionVerifierFixture);

      const hasStoreRole = await executionVerifier.read.hasRole([
        await executionVerifier.read.STORE_ROLE(),
        admin.account.address,
      ]);

      expect(hasStoreRole).to.be.true;
    });

    it("Should not grant STORE_ROLE to other users", async function () {
      const { executionVerifier, user1 } = await loadFixture(deployExecutionVerifierFixture);

      const hasStoreRole = await executionVerifier.read.hasRole([
        await executionVerifier.read.STORE_ROLE(),
        user1.account.address,
      ]);

      expect(hasStoreRole).to.be.false;
    });
  });

  describe("Hash Storage", function () {
    it("Should allow user with STORE_ROLE to store hash", async function () {
      const { executionVerifier, admin } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      await executionVerifier.write.storeHash([testHash], { account: admin.account.address });

      const isStored = await executionVerifier.read.isStored([testHash]);
      expect(isStored).to.be.true;
    });

    it("Should not allow user without STORE_ROLE to store hash", async function () {
      const { executionVerifier, user1 } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      await expect(
        executionVerifier.write.storeHash([testHash], { account: user1.account.address })
      ).to.be.rejected;
    });

    it("Should revert when trying to store the same hash twice", async function () {
      const { executionVerifier, admin } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      // Store hash first time
      await executionVerifier.write.storeHash([testHash], { account: admin.account.address });

      // Try to store the same hash again
      await expect(
        executionVerifier.write.storeHash([testHash], { account: admin.account.address })
      ).to.be.rejectedWith("HashAlreadyStored");
    });

    it("Should allow storing different hashes", async function () {
      const { executionVerifier, admin } = await loadFixture(deployExecutionVerifierFixture);

      const hash1 = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const hash2 = "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321";

      await executionVerifier.write.storeHash([hash1], { account: admin.account.address });
      await executionVerifier.write.storeHash([hash2], { account: admin.account.address });

      const isStored1 = await executionVerifier.read.isStored([hash1]);
      const isStored2 = await executionVerifier.read.isStored([hash2]);

      expect(isStored1).to.be.true;
      expect(isStored2).to.be.true;
    });

    it("Should return false for non-stored hashes", async function () {
      const { executionVerifier } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      const isStored = await executionVerifier.read.isStored([testHash]);
      expect(isStored).to.be.false;
    });
  });

  describe("Constants", function () {
    it("Should have correct STORE_ROLE value", async function () {
      const { executionVerifier } = await loadFixture(deployExecutionVerifierFixture);

      const storeRole = await executionVerifier.read.STORE_ROLE();
      const expectedStoreRole =
        "0x9cf888df9829983a4501c3e5076732bbf523e06c6b31f6ce065f61c2aec20567"; // keccak256("STORE_ROLE")

      expect(storeRole).to.equal(expectedStoreRole);
    });
  });
});
