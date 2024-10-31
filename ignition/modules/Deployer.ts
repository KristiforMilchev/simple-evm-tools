// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
import { parseUnits, parseEther } from "ethers";

const Deployer = buildModule("Factory", (m) => {
  var test = m.getParameter("_owner","0xadD6b56c8E5A0d5B7E1c3e8995CeC2925eE8d532");
  const ERC20TestnetToken = m.contract("Factory", [test],);

  return { ERC20TestnetToken };
});

export default Deployer;


