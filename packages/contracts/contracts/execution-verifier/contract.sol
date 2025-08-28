// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./errors.sol";
import "./interface.sol";

contract ExecutionVerifier is IExecutionVerifier, IExecutionVerifierErrors, AccessControl {
    bytes32 public constant STORE_ROLE = keccak256("STORE_ROLE");
    uint256 public constant MAX_BATCH_SIZE = 20;

    mapping(bytes32 => address) public isStored;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(STORE_ROLE, msg.sender);
    }

    function storeHash(bytes32 hash, address userAddress) external onlyRole(STORE_ROLE) {
        if (isStored[hash] != address(0)) {
            revert HashAlreadyStored(hash);
        }
        isStored[hash] = userAddress;
    }

    function storeHashBatch(bytes32[] calldata hashes, address[] calldata userAddresses) external onlyRole(STORE_ROLE) {
        if (hashes.length != userAddresses.length) {
            revert ArraysLengthMismatch();
        }
        
        if (hashes.length > MAX_BATCH_SIZE) {
            revert BatchSizeTooLarge(hashes.length, MAX_BATCH_SIZE);
        }

        for (uint256 i = 0; i < hashes.length; i++) {
            if (isStored[hashes[i]] != address(0)) {
                revert HashAlreadyStored(hashes[i]);
            }
            isStored[hashes[i]] = userAddresses[i];
        }
    }

    function grantStoreRoleBatch(address[] calldata addresses) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (addresses.length > MAX_BATCH_SIZE) {
            revert BatchSizeTooLarge(addresses.length, MAX_BATCH_SIZE);
        }
        
        for (uint256 i = 0; i < addresses.length; i++) {
            _grantRole(STORE_ROLE, addresses[i]);
        }
    }

    function revokeStoreRoleBatch(address[] calldata addresses) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (addresses.length > MAX_BATCH_SIZE) {
            revert BatchSizeTooLarge(addresses.length, MAX_BATCH_SIZE);
        }
        
        for (uint256 i = 0; i < addresses.length; i++) {
            address targetAddress = addresses[i];
            
            // Prevent revoking from admin
            if (hasRole(DEFAULT_ADMIN_ROLE, targetAddress)) {
                revert CannotRevokeFromAdmin();
            }
            
            // Prevent revoking from self
            if (targetAddress == msg.sender) {
                revert CannotRevokeFromSelf();
            }
            
            _revokeRole(STORE_ROLE, targetAddress);
        }
    }

    function hasStoreRoleBatch(address[] calldata addresses) external view returns (bool[] memory) {
        if (addresses.length > MAX_BATCH_SIZE) {
            revert BatchSizeTooLarge(addresses.length, MAX_BATCH_SIZE);
        }
        
        bool[] memory results = new bool[](addresses.length);
        
        for (uint256 i = 0; i < addresses.length; i++) {
            results[i] = hasRole(STORE_ROLE, addresses[i]);
        }
        
        return results;
    }
}