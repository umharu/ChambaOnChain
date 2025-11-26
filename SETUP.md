# Setup Guide - ChambaOnChain Frontend

## Environment Variables

Create a `.env.local` file in the `client` directory with the following variables:

```env
# Smart Contract Configuration
# Replace with your deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Blockchain Network Configuration
# Chain ID: 11155111 for Sepolia, 31337 for localhost
NEXT_PUBLIC_CHAIN_ID=11155111

# RPC URL (optional, but recommended for better performance)
# For Sepolia - Recommended options:
# - Alchemy: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
# - Infura: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
# - Public (slow): https://rpc.sepolia.org
# For localhost: http://127.0.0.1:8545
NEXT_PUBLIC_RPC_URL=

# IPFS Configuration
# Option 1: Web3.Storage (recommended)
# Get your API key from https://web3.storage/
NEXT_PUBLIC_WEB3_STORAGE_KEY=

# Option 2: Pinata (alternative)
# Get your API keys from https://www.pinata.cloud/
NEXT_PUBLIC_PINATA_API_KEY=
NEXT_PUBLIC_PINATA_SECRET_KEY=
```

## Steps to Setup

1. **Deploy the Smart Contract**
   - Navigate to `smart_contract` directory
   - Compile: `npx hardhat compile`
   - Deploy: `npx hardhat run scripts/deploy.js --network sepolia`
   - Copy the deployed contract address

2. **Configure Environment Variables**
   - Create `.env.local` in the `client` directory
   - Add your contract address to `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Set `NEXT_PUBLIC_CHAIN_ID` to match your network (11155111 for Sepolia)

3. **Setup IPFS (Choose one option)**
   
   **Option A: Web3.Storage (Recommended)**
   - Sign up at https://web3.storage/
   - Get your API key
   - Add it to `NEXT_PUBLIC_WEB3_STORAGE_KEY`
   
   **Option B: Pinata**
   - Sign up at https://www.pinata.cloud/
   - Get your API key and secret key
   - Add them to `NEXT_PUBLIC_PINATA_API_KEY` and `NEXT_PUBLIC_PINATA_SECRET_KEY`

4. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Open http://localhost:3000
   - Connect your MetaMask wallet
   - Navigate to the dashboard to upload PDFs

## Features

- ✅ Wallet connection with MetaMask
- ✅ PDF upload to IPFS
- ✅ Store IPFS URLs on blockchain
- ✅ View uploaded files
- ✅ Manage access permissions
- ✅ Share files with other users

## Troubleshooting

### Contract Address Error
- Make sure `NEXT_PUBLIC_CONTRACT_ADDRESS` is set correctly
- Verify the contract is deployed on the correct network

### IPFS Upload Fails
- Check your IPFS service API keys
- For development, the app will use a placeholder URL (files won't persist)
- For production, you MUST configure a proper IPFS service

### Transaction Fails
- Make sure you have enough ETH for gas fees
- Verify you're connected to the correct network
- Check that MetaMask is unlocked

