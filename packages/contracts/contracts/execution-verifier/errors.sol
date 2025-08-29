// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IExecutionVerifierErrors {
    ///@notice Error thrown when the hash is already stored
    error HashAlreadyStored(bytes32 hash);
    
    ///@notice Error thrown when arrays length don't match
    error ArraysLengthMismatch();
    
    ///@notice Error thrown when trying to revoke role from admin
    error CannotRevokeFromAdmin();
    
    ///@notice Error thrown when trying to revoke role from self
    error CannotRevokeFromSelf();
    
    ///@notice Error thrown when batch size exceeds maximum limit
    error BatchSizeTooLarge(uint256 size, uint256 maxSize);
}
