# RPC Endpoint Setup - Fix Timeout Issues

## Problem
The default public RPC endpoint (`https://rpc.sepolia.org`) can be slow and timeout. This causes errors like:
- "The request took too long to respond"
- "Request timed out"
- Files not loading

## Solution: Use a Better RPC Endpoint

### Option 1: Alchemy (Recommended - Free)

1. **Sign up for free at [Alchemy](https://www.alchemy.com/)**
2. **Create a new app:**
   - Go to Dashboard
   - Click "Create App"
   - Name: "ChambaOnChain"
   - Network: Sepolia
   - Click "Create App"

3. **Get your API Key:**
   - Click on your app
   - Copy the "API Key" (starts with `alcht_...`)

4. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```
   Replace `YOUR_API_KEY` with your actual API key.

### Option 2: Infura (Free)

1. **Sign up for free at [Infura](https://www.infura.io/)**
2. **Create a new project:**
   - Go to Dashboard
   - Click "Create New Key"
   - Network: Web3 API
   - Name: "ChambaOnChain"
   - Click "Create"

3. **Get your Project ID:**
   - Copy the "Project ID" (long string)

4. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ```
   Replace `YOUR_PROJECT_ID` with your actual project ID.

### Option 3: QuickNode (Free Tier Available)

1. **Sign up at [QuickNode](https://www.quicknode.com/)**
2. **Create an endpoint:**
   - Network: Ethereum
   - Chain: Sepolia Testnet
   - Copy the HTTP endpoint URL

3. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_RPC_URL=YOUR_QUICKNODE_ENDPOINT_URL
   ```

## After Setup

1. **Restart your development server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Try loading your files again**

## Current Configuration

The app now includes:
- ✅ 30-second timeout (instead of default)
- ✅ Automatic retry (3 attempts)
- ✅ Better error messages
- ✅ Support for custom RPC endpoints

## Why This Helps

- **Faster responses:** Private RPC endpoints are much faster
- **More reliable:** Less likely to timeout
- **Better uptime:** Professional infrastructure
- **Free tier:** All options above have free tiers

## Troubleshooting

If you still get timeouts:
1. Check your internet connection
2. Verify the RPC URL is correct in `.env.local`
3. Make sure you restarted the dev server after adding the RPC URL
4. Try a different RPC provider



