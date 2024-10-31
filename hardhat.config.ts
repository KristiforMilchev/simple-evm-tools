import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import HDWalletProvider from "@truffle/hdwallet-provider";
import * as dotenv from "dotenv";

dotenv.config();

// Load private key(s) and RPC URL from .env file
let privateKey: string | string[] = process.env.PRIVATE_KEY || "";
const testAccounts: string | string[] = process.env.LOCAL_TESTNET_ACCOUNTS || "";
const devRpcUrl: string = process.env.DEV_RPC_URL || "";

if (privateKey.includes(",")) {
  privateKey = privateKey.split(",").map((key) => key.trim());
} else {
  privateKey = privateKey.trim();
}

const localAccounts: string[] = testAccounts.split(',').map((key) => key.trim());
if (!privateKey || !devRpcUrl) {
  console.error("Error: Environment variables PRIVATE_KEY and DEV_RPC_URL are required.");
  process.exit(1);
}
console.log(localAccounts)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27", // Use the latest version or set the required version for specific contracts
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    development: {
      url: devRpcUrl,
      accounts: Array.isArray(privateKey) ? privateKey : [privateKey],
      gas: 6721975000000000,
      gasPrice: 20000000000,
    },
    local: {
      url: "HTTP://127.0.0.1:7545",
      accounts: localAccounts,
      gas: 60721975,
      gasPrice: 20000000000,
    },
  },
  mocha: {
    timeout: 120000, // 2 minutes
  },
};

export default config;
