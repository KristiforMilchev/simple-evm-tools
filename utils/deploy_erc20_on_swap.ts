import { ethers } from "hardhat";
import dotenv from "dotenv";
import { parseUnits, parseEther } from "ethers";

dotenv.config();

async function main(MY_TOKEN_ADDRESS: string, amountTokenDesired: string, amountETHDesired: string) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", ethers.provider);
    const provider = wallet.provider;

    const pancakeswapRouterAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; // Example router address

    // ERC20 Token Contract
    const token = new ethers.Contract(
        MY_TOKEN_ADDRESS,
        [
            "function approve(address spender, uint amount) external returns (bool)",
            "function balanceOf(address owner) external view returns (uint256)"
        ],
        provider
    );

    const pancakeswapRouter:any = new ethers.Contract(
        pancakeswapRouterAddress,
        [
            "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
        ],
        provider
    );

    const amountTokenDesiredParsed = parseUnits(amountTokenDesired, 18); 
    const amountETHDesiredParsed = parseEther(amountETHDesired);  
    const amountTokenMin = parseUnits("0", 18); 
    const amountETHMin = parseEther("0"); 
    const to = wallet.address; 
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; 

    try {
        const signer = wallet.connect(provider);
        const tokenWithSigner:any = token.connect(signer);
            
        await tokenWithSigner.approve(pancakeswapRouterAddress, amountTokenDesiredParsed);
        // Add liquidity logic here...
        console.log("Adding liquidity with the following parameters:");
        console.log("Token Address:", MY_TOKEN_ADDRESS);
        console.log("Amount Token Desired:", amountTokenDesiredParsed.toString());
        console.log("Amount Token Min:", amountTokenMin.toString());
        console.log("Amount ETH Min:", amountETHMin.toString());
        console.log("To Address:", to);
        console.log("Deadline:", deadline);
        console.log("Value (ETH):", amountETHDesiredParsed.toString());

        const gasLimit = 6721975;  
        const tx = await pancakeswapRouter.connect(signer).addLiquidityETH(
            MY_TOKEN_ADDRESS,
            amountTokenDesiredParsed,
            amountTokenMin,
            amountETHMin,
            to,
            deadline,
            { value: amountETHDesiredParsed, gasLimit }
        );

        console.log("Adding liquidity transaction hash:", tx.hash);
        await tx.wait();
        console.log("Liquidity added successfully!");
        console.log("Liquidity added successfully!");
    } catch (ex) {
        console.error("Error during adding liquidity:", ex);
    }
}

const args = process.argv.slice(2);
if (args.length !== 3) {
    console.error("Please provide MY_TOKEN_ADDRESS, amountTokenDesired, and amountETHDesired.");
    process.exit(1);
}

const [MY_TOKEN_ADDRESS, amountTokenDesired, amountETHDesired] = args;
main(MY_TOKEN_ADDRESS, amountTokenDesired, amountETHDesired).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
