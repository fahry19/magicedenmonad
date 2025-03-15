const Web3 = require('web3');
require('dotenv').config();

// RPC URL for Monad testnet
const RPC_URL = 'https://testnet-rpc.monad.xyz';
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// Load wallet from private key
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

console.log(`Wallet Loaded: ${account.address}`);

// Magic Eden minting contract details (Example, replace with actual values)
const MAGIC_EDEN_CONTRACT = '0xMagicEdenMintContractAddress';
const MAGIC_EDEN_ABI = [ /* Add Magic Eden contract ABI here */ ];
const MINT_FUNCTION = 'mint'; // Adjust as needed

// Function to mint NFT on Magic Eden
const mintNFT = async () => {
    try {
        const contract = new web3.eth.Contract(MAGIC_EDEN_ABI, MAGIC_EDEN_CONTRACT);
        const txData = contract.methods[MINT_FUNCTION]().encodeABI();

        const tx = {
            from: account.address,
            to: MAGIC_EDEN_CONTRACT,
            data: txData,
            gas: await web3.eth.estimateGas({ from: account.address, to: MAGIC_EDEN_CONTRACT, data: txData }),
            gasPrice: await web3.eth.getGasPrice()
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Minting Successful:', receipt.transactionHash);
    } catch (error) {
        console.error('Minting Failed:', error);
    }
};
