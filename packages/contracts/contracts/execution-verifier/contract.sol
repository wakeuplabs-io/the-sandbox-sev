// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./errors.sol";
import "./interface.sol";

contract ExecutionVerifier is IExecutionVerifier, IExecutionVerifierErrors, AccessControl {
    bytes32 public constant STORE_ROLE = keccak256("STORE_ROLE");

    mapping(bytes32 => bool) public isStored;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(STORE_ROLE, msg.sender);
    }

    function storeHash(bytes32 hash) external onlyRole(STORE_ROLE) {
        if (isStored[hash]) {
            revert HashAlreadyStored(hash);
        }
        isStored[hash] = true;
    }
}