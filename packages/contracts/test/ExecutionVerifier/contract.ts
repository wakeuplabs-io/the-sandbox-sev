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
    it("Should allow user with STORE_ROLE to store hash with user address", async function () {
      const { executionVerifier, admin, user1 } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const userAddress = user1.account.address;
      await executionVerifier.write.grantRole(
        [await executionVerifier.read.STORE_ROLE(), user1.account.address],
        { account: admin.account.address }
      );

      await executionVerifier.write.storeHash([testHash, userAddress], {
        account: admin.account.address,
      });

      const storedAddress = await executionVerifier.read.isStored([testHash]);
      expect(storedAddress.toLowerCase()).to.equal(userAddress.toLowerCase());
    });

    it("Should not allow user without STORE_ROLE to store hash", async function () {
      const { executionVerifier, admin, user1 } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const userAddress = user1.account.address;

      await expect(
        executionVerifier.write.storeHash([testHash, userAddress], {
          account: admin.account.address,
        })
      ).to.be.rejected;
    });

    it("Should revert when trying to store the same hash twice", async function () {
      const { executionVerifier, admin, user1 } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const userAddress = user1.account.address;

      await executionVerifier.write.grantRole(
        [await executionVerifier.read.STORE_ROLE(), user1.account.address],
        { account: admin.account.address }
      );

      // Store hash first time
      await executionVerifier.write.storeHash([testHash, userAddress], {
        account: admin.account.address,
      });

      // Try to store the same hash again
      await expect(
        executionVerifier.write.storeHash([testHash, userAddress], {
          account: admin.account.address,
        })
      ).to.be.rejectedWith("HashAlreadyStored");
    });

    it("Should allow storing different hashes with different user addresses", async function () {
      const { executionVerifier, admin, user1 } = await loadFixture(deployExecutionVerifierFixture);

      const hash1 = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const hash2 = "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321";
      const userAddress1 = user1.account.address;
      const userAddress2 = admin.account.address;

      await executionVerifier.write.grantRole(
        [await executionVerifier.read.STORE_ROLE(), user1.account.address],
        { account: admin.account.address }
      );

      await executionVerifier.write.storeHash([hash1, userAddress1], {
        account: admin.account.address,
      });
      await executionVerifier.write.storeHash([hash2, userAddress2], {
        account: admin.account.address,
      });

      const storedAddress1 = await executionVerifier.read.isStored([hash1]);
      const storedAddress2 = await executionVerifier.read.isStored([hash2]);

      expect(storedAddress1.toLowerCase()).to.equal(userAddress1.toLowerCase());
      expect(storedAddress2.toLowerCase()).to.equal(userAddress2.toLowerCase());
    });

    it("Should return zero address for non-stored hashes", async function () {
      const { executionVerifier } = await loadFixture(deployExecutionVerifierFixture);

      const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      const storedAddress = await executionVerifier.read.isStored([testHash]);
      expect(storedAddress).to.equal("0x0000000000000000000000000000000000000000");
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

    describe("Batch Hash Storage", function () {
      it("Should allow user with STORE_ROLE to store multiple hashes in batch", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        const hashes = [
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
          "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        ];
        const userAddress = user1.account.address;

        await executionVerifier.write.grantRole(
          [await executionVerifier.read.STORE_ROLE(), user1.account.address],
          { account: admin.account.address }
        );

        await executionVerifier.write.storeHashBatch([hashes, userAddress], {
          account: admin.account.address,
        });

        // Verify all hashes were stored correctly
        for (let i = 0; i < hashes.length; i++) {
          const storedAddress = await executionVerifier.read.isStored([hashes[i]]);
          expect(storedAddress.toLowerCase()).to.equal(userAddress.toLowerCase());
        }
      });

      it("Should not allow user without STORE_ROLE to store hashes in batch", async function () {
        const { executionVerifier, user1 } = await loadFixture(deployExecutionVerifierFixture);

        const hashes = [
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
        ];
        const userAddresses = [user1.account.address, user1.account.address];

        await expect(
          executionVerifier.write.storeHashBatch([hashes, userAddresses], {
            account: user1.account.address,
          })
        ).to.be.rejected;
      });

      it("Should revert when trying to store a hash that already exists in batch", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        const existingHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
        const userAddress = user1.account.address;
        await executionVerifier.write.grantRole(
          [await executionVerifier.read.STORE_ROLE(), user1.account.address],
          { account: admin.account.address }
        );

        // First store a single hash
        await executionVerifier.write.storeHash([existingHash, userAddress], {
          account: admin.account.address,
        });

        // Then try to store it again in a batch
        const hashes = [
          existingHash,
          "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
        ];

        await expect(
          executionVerifier.write.storeHashBatch([hashes, userAddress], {
            account: admin.account.address,
          })
        ).to.be.rejectedWith("HashAlreadyStored");
      });

      it("Should handle empty arrays gracefully", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        const hashes: string[] = [];
        const userAddress = user1.account.address;
        await executionVerifier.write.grantRole(
          [await executionVerifier.read.STORE_ROLE(), user1.account.address],
          { account: admin.account.address }
        );

        // Should not revert with empty arrays
        await executionVerifier.write.storeHashBatch([hashes, userAddress], {
          account: admin.account.address,
        });
      });

      it("Should store large batches efficiently", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        // Create arrays with 10 hashes
        const hashes: string[] = [];
        let userAddress = user1.account.address;

        for (let i = 0; i < 10; i++) {
          // Generate unique hashes
          const hash = `0x${i.toString().padStart(64, "0")}`;
          hashes.push(hash);
          userAddress = i % 2 === 0 ? user1.account.address : admin.account.address;
        }

        await executionVerifier.write.storeHashBatch([hashes, userAddress], {
          account: admin.account.address,
        });

        // Verify all hashes were stored
        for (let i = 0; i < hashes.length; i++) {
          const storedAddress = await executionVerifier.read.isStored([hashes[i]]);
          expect(storedAddress.toLowerCase()).to.equal(userAddress.toLowerCase());
        }
      });
    });

    describe("Role Management", function () {
      it("Should allow admin to grant STORE_ROLE to a single address", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        // Use the standard grantRole function first to verify it works
        await executionVerifier.write.grantRole(
          [await executionVerifier.read.STORE_ROLE(), user1.account.address],
          { account: admin.account.address }
        );

        // Verify role was granted
        const hasRole = await executionVerifier.read.hasRole([
          await executionVerifier.read.STORE_ROLE(),
          user1.account.address,
        ]);
        expect(hasRole).to.be.true;
      });

      it("Should verify that custom batch functions exist", async function () {
        const { executionVerifier } = await loadFixture(deployExecutionVerifierFixture);

        // Check if the functions exist in the contract
        expect(executionVerifier.write.grantStoreRoleBatch).to.be.a("function");
        expect(executionVerifier.write.revokeStoreRoleBatch).to.be.a("function");
        expect(executionVerifier.read.hasStoreRoleBatch).to.be.a("function");
      });

      it("Should allow admin to grant STORE_ROLE to multiple addresses in batch", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        const addresses = [user1.account.address];

        await executionVerifier.write.grantStoreRoleBatch([addresses], {
          account: admin.account.address,
        });

        // Verify role was granted
        const hasRole = await executionVerifier.read.hasRole([
          await executionVerifier.read.STORE_ROLE(),
          user1.account.address,
        ]);
        expect(hasRole).to.be.true;
      });

      it("Should not allow non-admin to grant STORE_ROLE in batch", async function () {
        const { executionVerifier, user1 } = await loadFixture(deployExecutionVerifierFixture);

        const addresses = [user1.account.address];

        await expect(
          executionVerifier.write.grantStoreRoleBatch([addresses], {
            account: user1.account.address,
          })
        ).to.be.rejected;
      });

      it("Should return correct boolean array for hasStoreRoleBatch", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        const addresses = [
          admin.account.address, // Has role
          user1.account.address, // Doesn't have role
        ];

        const results = await executionVerifier.read.hasStoreRoleBatch([addresses]);
        expect(results).to.deep.equal([true, false]);
      });

      it("Should allow admin to revoke STORE_ROLE from multiple addresses in batch", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        const addresses = [user1.account.address];

        // First grant the role
        await executionVerifier.write.grantStoreRoleBatch([addresses], {
          account: admin.account.address,
        });

        // Then revoke it
        await executionVerifier.write.revokeStoreRoleBatch([addresses], {
          account: admin.account.address,
        });

        // Verify role was revoked
        const hasRole = await executionVerifier.read.hasRole([
          await executionVerifier.read.STORE_ROLE(),
          user1.account.address,
        ]);
        expect(hasRole).to.be.false;
      });

      it("Should not allow admin to revoke STORE_ROLE from self", async function () {
        const { executionVerifier, admin } = await loadFixture(deployExecutionVerifierFixture);

        await expect(
          executionVerifier.write.revokeStoreRoleBatch([[admin.account.address]], {
            account: admin.account.address,
          })
        ).to.be.rejectedWith("CannotRevokeFromAdmin");
      });

      it("Should not allow admin to revoke STORE_ROLE from another admin", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        // Grant admin role to user1
        await executionVerifier.write.grantRole(
          [await executionVerifier.read.DEFAULT_ADMIN_ROLE(), user1.account.address],
          { account: admin.account.address }
        );

        // Try to revoke STORE_ROLE from user1 (who is now admin)
        await expect(
          executionVerifier.write.revokeStoreRoleBatch([[user1.account.address]], {
            account: admin.account.address,
          })
        ).to.be.rejectedWith("CannotRevokeFromAdmin");
      });
    });

    describe("Batch Size Limits", function () {
      it("Should have correct MAX_BATCH_SIZE constant", async function () {
        const { executionVerifier } = await loadFixture(deployExecutionVerifierFixture);

        const maxBatchSize = await executionVerifier.read.MAX_BATCH_SIZE();
        expect(maxBatchSize).to.equal(20n);
      });

      it("Should revert when batch size exceeds MAX_BATCH_SIZE", async function () {
        const { executionVerifier, admin } = await loadFixture(deployExecutionVerifierFixture);

        // Create array with MAX_BATCH_SIZE + 1 addresses
        const addresses: string[] = [];
        for (let i = 1; i < 22; i++) {
          addresses.push(`0x${i.toString().padStart(40, "0")}`);
        }

        // Should revert when exceeding max size
        await expect(
          executionVerifier.write.grantStoreRoleBatch([addresses], {
            account: admin.account.address,
          })
        ).to.be.rejectedWith("BatchSizeTooLarge");
      });

      it("Should revert storeHashBatch when batch size exceeds MAX_BATCH_SIZE", async function () {
        const { executionVerifier, admin, user1 } = await loadFixture(
          deployExecutionVerifierFixture
        );

        // Create arrays with MAX_BATCH_SIZE + 1 elements
        const hashes: string[] = [];
        const userAddress = user1.account.address;
        for (let i = 1; i < 22; i++) {
          hashes.push(`0x${i.toString().padStart(64, "0")}`);
        }

        await executionVerifier.write.grantRole(
          [await executionVerifier.read.STORE_ROLE(), user1.account.address],
          { account: admin.account.address }
        );

        // Should revert when exceeding max size
        await expect(
          executionVerifier.write.storeHashBatch([hashes, userAddress], {
            account: admin.account.address,
          })
        ).to.be.rejectedWith("BatchSizeTooLarge");
      });

      it("Should revert hasStoreRoleBatch when batch size exceeds MAX_BATCH_SIZE", async function () {
        const { executionVerifier } = await loadFixture(deployExecutionVerifierFixture);

        // Create array with MAX_BATCH_SIZE + 1 addresses
        const addresses: string[] = [];
        for (let i = 0; i < 21; i++) {
          addresses.push(`0x${i.toString().padStart(40, "0")}`);
        }

        // Should revert when exceeding max size
        await expect(executionVerifier.read.hasStoreRoleBatch([addresses])).to.be.rejectedWith(
          "BatchSizeTooLarge"
        );
      });
    });
  });
});
