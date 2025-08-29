// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IExecutionVerifier {
    /**
     * @dev Stores the hash of the execution.
     * @param hash The hash of the execution.
     * @param userAddress The address of the user who executed the transaction.
     */
    function storeHash(bytes32 hash, address userAddress) external;

    /**
     * @dev Stores multiple hashes in a single transaction.
     * @param hashes Array of hashes to store (max 20).
     * @param userAddresses Array of user addresses corresponding to each hash (max 20).
     */
    function storeHashBatch(bytes32[] calldata hashes, address[] calldata userAddresses) external;

    /**
     * @dev Grants STORE_ROLE to multiple addresses in a single transaction.
     * @param addresses Array of addresses to grant STORE_ROLE to (max 20).
     */
    function grantStoreRoleBatch(address[] calldata addresses) external;

    /**
     * @dev Revokes STORE_ROLE from multiple addresses in a single transaction.
     * @param addresses Array of addresses to revoke STORE_ROLE from (max 20).
     */
    function revokeStoreRoleBatch(address[] calldata addresses) external;

    /**
     * @dev Checks if multiple addresses have STORE_ROLE.
     * @param addresses Array of addresses to check (max 20).
     * @return Array of booleans indicating if each address has STORE_ROLE.
     */
    function hasStoreRoleBatch(address[] calldata addresses) external view returns (bool[] memory);
}
