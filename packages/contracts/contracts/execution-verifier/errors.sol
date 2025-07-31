// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IExecutionVerifierErrors {
    ///@notice Error thrown when the hash is already stored
    error HashAlreadyStored(bytes32 hash);
}
