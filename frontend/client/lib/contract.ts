"use client"

import { createPublicClient, createWalletClient, custom, http, type Address, type Chain } from "viem"
import UploadABI from "@/abi/Upload.json"

// Define chains manually if viem/chains is not available
const sepolia: Chain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.org"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
} as Chain

const localhost: Chain = {
  id: 31337,
  name: "Localhost",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
} as Chain

// Get the contract address from environment or use a default
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as Address

// Helper function to validate ABI
function validateABI() {
  if (!UploadABI || !UploadABI.abi || !Array.isArray(UploadABI.abi)) {
    throw new Error("Upload ABI is not valid. Please check abi/Upload.json")
  }
  return UploadABI.abi
}

// Get the chain from environment or default to sepolia
const getChain = () => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  if (chainId === "11155111" || !chainId) {
    return sepolia
  }
  if (chainId === "31337") {
    return localhost
  }
  return sepolia
}

// Create public client for read operations
export function getPublicClient() {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
  const chain = getChain()
  
  // Use custom RPC if provided, otherwise use chain default
  // Add timeout and retry configuration for better reliability
  const transport = rpcUrl 
    ? http(rpcUrl, {
        timeout: 30_000, // 30 second timeout
        retryCount: 3, // Retry up to 3 times
        retryDelay: 1000, // Wait 1 second between retries
      })
    : http(chain.rpcUrls.default.http[0], {
        timeout: 30_000,
        retryCount: 3,
        retryDelay: 1000,
      })
  
  return createPublicClient({
    chain: chain,
    transport: transport,
    batch: {
      multicall: false, // Disable multicall to avoid issues
    },
  })
}

// Create wallet client for write operations
export function getWalletClient() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed")
  }
  return createWalletClient({
    chain: getChain(),
    transport: custom(window.ethereum),
  })
}

// Contract interaction functions
export async function addFile(userAddress: Address, ipfsUrl: string) {
  // Check if contract address is set
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("La dirección del contrato no está configurada. Por favor, configura NEXT_PUBLIC_CONTRACT_ADDRESS en .env.local")
  }

  // Validate inputs
  if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección de usuario inválida")
  }
  if (!ipfsUrl || typeof ipfsUrl !== "string" || ipfsUrl.trim() === "") {
    throw new Error("URL de IPFS inválida")
  }

  // Validate ABI
  const abi = validateABI()

  const walletClient = getWalletClient()
  const publicClient = getPublicClient()
  const accounts = await walletClient.getAddresses()
  
  if (!accounts || accounts.length === 0) {
    throw new Error("No hay cuentas conectadas. Por favor, conecta tu wallet.")
  }
  
  const account = accounts[0]
  if (!account) {
    throw new Error("No se pudo obtener la cuenta de la wallet")
  }
  
  console.log("Contract address:", CONTRACT_ADDRESS)
  console.log("User address:", userAddress)
  console.log("IPFS URL:", ipfsUrl)
  console.log("Account:", account)
  
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "add",
      args: [userAddress, ipfsUrl],
      account,
    })
    
    console.log("Transaction sent, hash:", hash)
    console.log("Transaction will be confirmed in the background")
    
    // Return immediately - don't wait for confirmation
    // The transaction is sent and will be confirmed on the blockchain
    // User can see it in their wallet and on Etherscan
    
    return hash
  } catch (error: any) {
    console.error("Error in addFile:", error)
    // Re-throw with better error message
    if (error.message?.includes("User rejected") || error.message?.includes("denied")) {
      throw new Error("Transacción cancelada por el usuario")
    }
    // If we have a hash in the error, include it
    if (error.message?.includes("Timed out") && error.hash) {
      throw new Error(`Timeout esperando confirmación. La transacción fue enviada: ${error.hash}. Puedes verificarla en Etherscan.`)
    }
    throw error
  }
}

export async function displayFiles(userAddress: Address, viewerAddress: Address): Promise<string[]> {
  // Check if contract address is set
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("La dirección del contrato no está configurada. Por favor, configura NEXT_PUBLIC_CONTRACT_ADDRESS en .env.local")
  }

  // Validate addresses
  if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección de usuario inválida")
  }
  
  if (!viewerAddress || viewerAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección del visor inválida")
  }

  // Validate ABI
  const abi = validateABI()

  const publicClient = getPublicClient()
  
  console.log("displayFiles - Contract address:", CONTRACT_ADDRESS)
  console.log("displayFiles - User address (owner):", userAddress)
  console.log("displayFiles - Viewer address (msg.sender):", viewerAddress)
  console.log("displayFiles - Same address?", userAddress.toLowerCase() === viewerAddress.toLowerCase())
  
  try {
    // For view functions that check msg.sender, we use account parameter
    // Note: In viem, account must be a valid address format
    const files = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "display",
      args: [userAddress],
      account: viewerAddress, // This sets msg.sender in the contract call
    })
    
    console.log("displayFiles - Files retrieved:", files)
    console.log("displayFiles - Number of files:", files?.length || 0)
    
    // Ensure we return an array
    if (!Array.isArray(files)) {
      console.warn("displayFiles - Files is not an array, returning empty array")
      return []
    }
    
    return files as string[]
  } catch (error: any) {
    console.error("displayFiles - Error details:", {
      message: error.message,
      name: error.name,
      cause: error.cause,
      stack: error.stack,
    })
    
    // Check for access denied error
    if (error.message?.includes("You don't have access") || 
        error.message?.includes("access") ||
        error.message?.includes("No tienes acceso")) {
      // If user is viewing their own files, this shouldn't happen
      if (userAddress.toLowerCase() === viewerAddress.toLowerCase()) {
        throw new Error("No se pudieron cargar tus archivos. Verifica que hayas subido archivos con esta wallet.")
      }
      throw new Error("No tienes acceso a estos archivos")
    }
    
    // Check for contract not found or invalid address
    if (error.message?.includes("execution reverted") || 
        error.message?.includes("revert") ||
        error.message?.includes("invalid address")) {
      throw new Error("Error al leer el contrato. Verifica que la dirección del contrato sea correcta y que esté desplegado en la red correcta.")
    }
    
    // Check for network errors and timeouts
    if (error.message?.includes("network") || 
        error.message?.includes("fetch") ||
        error.message?.includes("timeout") ||
        error.message?.includes("took too long") ||
        error.message?.includes("Request timed out")) {
      throw new Error("Timeout al conectar con la blockchain. El servidor RPC está lento. Intenta de nuevo o configura un RPC más rápido en .env.local (NEXT_PUBLIC_RPC_URL)")
    }
    
    // Generic error
    throw new Error(`Error al cargar archivos: ${error.message || "Error desconocido"}`)
  }
}

export async function allowAccess(ownerAddress: Address, userAddress: Address) {
  // Validate inputs
  if (!ownerAddress || ownerAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección del propietario inválida")
  }
  if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección de usuario inválida")
  }
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("La dirección del contrato no está configurada")
  }
  const abi = validateABI()

  const walletClient = getWalletClient()
  const publicClient = getPublicClient()
  const accounts = await walletClient.getAddresses()
  
  if (!accounts || accounts.length === 0) {
    throw new Error("No hay cuentas conectadas. Por favor, conecta tu wallet.")
  }
  
  const account = accounts[0]
  if (!account) {
    throw new Error("No se pudo obtener la cuenta de la wallet")
  }
  
  if (account.toLowerCase() !== ownerAddress.toLowerCase()) {
    throw new Error("Solo el propietario puede otorgar acceso")
  }
  
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: "allow",
    args: [userAddress],
    account,
  })
  
  // Wait for transaction confirmation with increased timeout
  try {
    await publicClient.waitForTransactionReceipt({ 
      hash,
      timeout: 300_000, // 5 minutes
    })
  } catch (timeoutError: any) {
    if (timeoutError.message?.includes("Timed out") || timeoutError.message?.includes("timeout")) {
      console.warn("Transaction confirmation timed out, but transaction was sent:", hash)
      return hash
    }
    throw timeoutError
  }
  
  return hash
}

export async function disallowAccess(ownerAddress: Address, userAddress: Address) {
  // Validate inputs
  if (!ownerAddress || ownerAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección del propietario inválida")
  }
  if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección de usuario inválida")
  }
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("La dirección del contrato no está configurada")
  }
  const abi = validateABI()

  const walletClient = getWalletClient()
  const publicClient = getPublicClient()
  const accounts = await walletClient.getAddresses()
  
  if (!accounts || accounts.length === 0) {
    throw new Error("No hay cuentas conectadas. Por favor, conecta tu wallet.")
  }
  
  const account = accounts[0]
  if (!account) {
    throw new Error("No se pudo obtener la cuenta de la wallet")
  }
  
  if (account.toLowerCase() !== ownerAddress.toLowerCase()) {
    throw new Error("Solo el propietario puede revocar acceso")
  }
  
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: "disallow",
    args: [userAddress],
    account,
  })
  
  // Wait for transaction confirmation with increased timeout
  try {
    await publicClient.waitForTransactionReceipt({ 
      hash,
      timeout: 300_000, // 5 minutes
    })
  } catch (timeoutError: any) {
    if (timeoutError.message?.includes("Timed out") || timeoutError.message?.includes("timeout")) {
      console.warn("Transaction confirmation timed out, but transaction was sent:", hash)
      return hash
    }
    throw timeoutError
  }
  
  return hash
}

export async function getSharedAccess(ownerAddress: Address) {
  // Validate inputs
  if (!ownerAddress || ownerAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Dirección del propietario inválida")
  }
  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("La dirección del contrato no está configurada")
  }
  const abi = validateABI()

  const publicClient = getPublicClient()
  
  const accessList = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: "shareAccess",
    account: ownerAddress,
  })
  
  return accessList as Array<{ user: Address; access: boolean }>
}

export { CONTRACT_ADDRESS }

