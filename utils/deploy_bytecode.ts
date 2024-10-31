import { ethers } from "hardhat";
import { readFileSync } from "fs";

async function main() {
  const [wallet] = await ethers.getSigners();
  let abi = JSON.parse(
    readFileSync("utils/contracts/pk_factory/abi.json", "utf8").trim()
  );
  const bytecode = readFileSync(
    "utils/contracts/pk_factory/factory",
    "utf8"
  ).trim();
  const feeToSetterAddress = "0xc0B9b3C5955FC6B2f2235045C40Bf20314eB1112"; // Your feeToSetter address
  const contractFactory = await ethers.getContractFactory(
    abi,
    bytecode,
    wallet
  );
  try {
    const deployedContract = await contractFactory.deploy(feeToSetterAddress, {
      gasLimit: 6000000,
    });
    console.log(await deployedContract.getAddress());
    // Log the contract address
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

main();
