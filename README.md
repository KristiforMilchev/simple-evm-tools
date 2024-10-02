# Simple EVM toolbox

While working on my awesome EVM based wallet for shared financial responsability into a few obsticles when it comes to debugging and testing
complicated contracts, or contracts that have external depdendencies on other contracts that might not always be present on the local network.

one of the first issues since i was working on a wallet was getting a decentralized factory and deploying my own liquidity, i quickly figured out how to
clone other networks but that meant that all the interfaces for interacting with those networks either had to be cloned as well, in certain cases literally impossible or go the other route and just build this simple repository which allows me to interact with ERC20 smart contracts and decentralized exchanges

## General information

since the project that i use this small toolbox of somewhat useful scripts i have two networks running on it.

- development: this is a custom RPC that i run in my small dev server so i can test stuff on remote devices, to ensure they are all connected to the same blockchain
- local this is just genache for me, but you're welcome to change it to whatever rpc you like as long as it's working.

## Usage

```
npx hardhat run scripts/addLiquidity.js --network bscTestnet 0xfC4B15EA75dc36CEf08D92031F9C3c3b495c0Cb0 100000 100
```

- this adds liquidity to a smart contract as long as your default addresses isn't any different than the default one. (For more info read the build steps.)

```
npx hardhat run utils/deploy_erc20_on_swap.ts --network local 0xfC4B15EA75dc36CEf08D92031F9C3c3b495c0Cb0 100000 100
```

- this command just swaps your main account ETH for the currency in the smart contract as long as it's deployed and it has liquidity.

```
npx hardhat run utils/swap_tokens.ts --network local 0xBEBE05e360012E849d64481a4b47d5c9B5274AF1 0xbb4cdb9c2024bd4b29c7b2f8e36b9848d4d1c6e4 1
```

- And finally this one transfers funds for a specific smart contract from one account to another, for example account1 has 10 DOG, and you put Account 2 as receiver account 1 will have 9 and account 2 will get 1.

## Build steps

Make sure you have NPM or yarn installed to install all of the depdencies which are as wells

- hardhat
- @pancakeswap/sdk (NPM)
- @truffle/hdwallet-provider
- dotenv
- ethers (for some reason with the current version of ethers from hardhat ethers.parseUnits doesn't work, that's why i included ethers probably wiser to write my own function but i am lazy sorry about that. You're welcome to do a good begginer PR for it.)

well just run npm install --save-dev

create an .env file in the root folder of the repository and add the following values

```
PRIVATE_KEY=private_key_1,private_key_2,private_key_2
LOCAL_TESTNET_ACCOUNTS=private_key_1,private_key_2,private_key_2
DEV_RPC_URL=your_own_remote_rpc if you have one. This one is used only in --network development


```

Important, my network is a clone of bsc testnet, so my factory and router are set to pancakeswap, you might need to change those if your cloning a different network on your local network.

The default hardhat commands for those that haven't had the pleasure of working with it.

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
