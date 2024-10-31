import { ethers } from "hardhat";
import dotenv from "dotenv";
import { parseUnits, parseEther } from "ethers";

dotenv.config();

async function main(MY_TOKEN_ADDRESS: string, amountETHDesired: string) {
  const keys: string = process.env.PRIVATE_KEY || "";
  const privateKey = keys.split(",")[0];
  const wallet = new ethers.Wallet(privateKey, ethers.provider);
  const provider = wallet.provider;

  if (!process.env.PKSwapRouter) {
    console.error("PKSwapRouter environment variable not found");
    return;
  }

  const pancakeswapRouterAddress = "0xD52367e37D020c866675648892040D3740934658";

  // ERC20 Token Contract setup
  const token = new ethers.Contract(
    MY_TOKEN_ADDRESS,
    [
      "function approve(address spender, uint amount) external returns (bool)",
      "function balanceOf(address owner) external view returns (uint256)",
      "function allowance(address owner, address spender) external view returns (uint256)",
    ],
    wallet // connect directly with wallet signer
  );

  const pancakeswapRouter = new ethers.Contract(
    pancakeswapRouterAddress,
    [
      "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
      "function factory() external view returns (address)", // Method to get WETH address
      "function WETH() external view returns (address)", // Method to get WETH address
    ],
    wallet // connect directly with wallet signer
  );

  const amountETHDesiredParsed = parseEther(amountETHDesired);
  const amountTokenMin = parseUnits("10", 18); // Min tokens to add
  const amountETHMin = parseEther("10"); // Min ETH to add
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  // Retrieve token balance of wallet
  const balance = await token.balanceOf(wallet.address);
  console.log("Token Balance:", balance.toString());

  // Check the token allowance
  const allowance = await token.allowance(
    wallet.address,
    pancakeswapRouterAddress
  );
  console.log("Allowance before adding liquidity:", allowance.toString());

  // Approve the router (if not done previously)
  if (allowance.lt(balance)) {
    const approveTx = await token.approve(pancakeswapRouterAddress, balance);
    await approveTx.wait();
    console.log("Token approved successfully:", approveTx.hash);
  }

  try {
    console.log("Using PancakeSwap Router Address:", pancakeswapRouterAddress);
    const wethAddress = await pancakeswapRouter.WETH();
    console.log("WETH Address:", wethAddress);
    const factory = await pancakeswapRouter.factory();
    console.log("Factory Address:", factory);
    // Approve PancakeSwap Router to spend the token amount
    const approveTx = await token.approve(pancakeswapRouterAddress, balance);
    await approveTx.wait();
    console.log("Token approval successful:", approveTx.hash);

    // Check if the approval was successful
    const updatedAllowance = await token.allowance(
      wallet.address,
      pancakeswapRouterAddress
    );
    console.log(
      "Updated Allowance after approval:",
      updatedAllowance.toString()
    );

    console.log("Adding liquidity with the following parameters:");
    console.log("Token Address:", MY_TOKEN_ADDRESS);
    console.log("Amount Token Desired:", balance.toString());
    console.log("Amount Token Min:", amountTokenMin.toString());
    console.log("Amount ETH Min:", amountETHMin.toString());
    console.log("To Address:", wallet.address);
    console.log("Deadline:", deadline);
    console.log("Value (ETH):", amountETHDesiredParsed.toString());

    const tx = await pancakeswapRouter.addLiquidityETH(
      MY_TOKEN_ADDRESS,
      balance,
      amountTokenMin,
      amountETHMin,
      wallet.address,
      deadline,
      { value: amountETHDesiredParsed, gasLimit: 6721975 }
    );

    console.log("Adding liquidity transaction hash:", tx.hash);
    await tx.wait();
    console.log("Liquidity added successfully!");
  } catch (ex) {
    console.error("Error during adding liquidity:", ex);
  }
}

// Run the script
main("0x04de3D55a09C0A700da3c9261434F160ad4E9d68", "100000").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
