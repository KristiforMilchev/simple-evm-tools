// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
import { parseUnits, parseEther } from "ethers";

const ERC20 = buildModule("ERC20TestnetToken", (m) => {
  
  const supply = m.getParameter("initialSupply", parseUnits("100000000", 18));
  const name = m.getParameter("name", "USDT");
  const symbol = m.getParameter("symbol", "USDT");
  const ERC20TestnetToken = m.contract("ERC20TestnetToken", [supply, name, symbol],);

  return { ERC20TestnetToken };
});

export default ERC20;


