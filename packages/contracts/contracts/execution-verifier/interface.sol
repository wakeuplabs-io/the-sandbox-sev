// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IExecutionVerifier {
    /**
     * @dev Stores the hash of the execution.
     * @param hash The hash of the execution.
     */
    function storeHash(bytes32 hash) external;
}
