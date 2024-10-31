// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Factory {
    event ContractDeployed(address newContract);
    address owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function deployContract(bytes memory bytecode) public returns (address) {
        address newContract;
        assembly {
            newContract := create(0, add(bytecode, 0x20), mload(bytecode))
        }

        require(newContract != address(0), "Contract creation failed");

        emit ContractDeployed(newContract);
        return newContract;
    }
}
