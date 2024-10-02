import { parseUnits } from "ethers";
import { ethers } from "hardhat";

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 4) {
        console.error("Please provide tokenName, tokenAddress, recipientAddress, and amount.");
        process.exit(1);
    }

    const [tokenName, tokenAddress, recipientAddress, amountStr] = args;
    const amount = parseUnits(amountStr, "gwei");  

    const Token = await ethers.getContractFactory(tokenName); 
    const token = Token.attach(tokenAddress);

    const [signer] = await ethers.getSigners();

    const contract: any = await token.connect(signer);
    
    const tx = await contract.transfer(recipientAddress, amount);
    console.log("Transaction Hash:", tx.hash);

    await tx.wait();
    console.log(`Successfully sent ${amount.toString()} tokens to ${recipientAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
