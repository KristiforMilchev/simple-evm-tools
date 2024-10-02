import { ethers } from "hardhat";
import dotenv from "dotenv";
import {
  ChainId,
  Fetcher,
  Route,
  Trade,
  TradeType,
  Percent,
  CurrencyAmount,  
} from "@pancakeswap/sdk";

dotenv.config();

const args = process.argv.slice(2);
if (args.length !== 3) {
    console.error("Please provide MY_TOKEN_ADDRESS, WBNB_ADDRESS, and amountIn.");
    process.exit(1);
}

const [MY_TOKEN_ADDRESS, WBNB_ADDRESS, amountInStr] = args;
const amountIn = parseFloat(amountInStr);

async function swapTokens() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", ethers.provider);
  const provider = await wallet.provider;

  const myToken = await Fetcher.fetchTokenData(
    ChainId.local,
    MY_TOKEN_ADDRESS as `0x${string}`,
    provider,
    "USDT",
  );

  const wbnb = await Fetcher.fetchTokenData(
    ChainId.local,
    WBNB_ADDRESS as `0x${string}`,
    provider,
    "WBNB", 
  );

  if (!myToken || !wbnb) {
    throw new Error("Failed to fetch token data");
  }

  const pair = await Fetcher.fetchPairData(myToken, wbnb);
  const route = new Route([pair], wbnb, myToken);

  const amountInCurrency = CurrencyAmount.fromRawAmount(wbnb, ethers.parseUnits(amountIn.toString()).toString());

  const trade = new Trade(
    route,
    amountInCurrency,
    TradeType.EXACT_INPUT
  );

  const slippageTolerance = new Percent("50", "10000"); 
  const amountOutMin = trade.minimumAmountOut(slippageTolerance); 
  const path = [wbnb.address, myToken.address];
  const to = wallet.address; 
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; 

  const pancakeswapRouter = new ethers.Contract(
    "0x6725F303b657a9451d8BA641348b6761A6CC7a17", 
    [
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)",
    ],
    wallet
  );

  const wbnbContract = new ethers.Contract(
    WBNB_ADDRESS,
    ["function approve(address spender, uint amount)"],
    wallet
  );

  await wbnbContract.approve(
    "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
    ethers.parseUnits(amountIn.toString())
  );

  const tx = await pancakeswapRouter.swapExactTokensForTokens(
    ethers.parseUnits(amountIn.toString()),
    amountOutMin.toString(),
    path,
    to,
    deadline
  );

  console.log("Swap Transaction Hash:", tx.hash);
  await tx.wait();
  console.log("Swap complete");
}

swapTokens().catch(console.error); 
