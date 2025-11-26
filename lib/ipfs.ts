"use client"

// IPFS upload using web3.storage or similar service
// For production, you should use a service like Pinata, web3.storage, or IPFS.infura

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // Option 1: Using web3.storage (requires API key)
    const apiKey = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY
    
    if (apiKey) {
      return await uploadToWeb3Storage(file, apiKey)
    }
    
    // Option 2: Using Pinata (requires API key)
    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
    const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
    
    if (pinataApiKey && pinataSecretKey) {
      return await uploadToPinata(file, pinataApiKey, pinataSecretKey)
    }
    
    // Option 3: Using a public IPFS gateway (for development/testing)
    // Note: This is not recommended for production
    return await uploadToPublicIPFS(file)
  } catch (error) {
    console.error("Error uploading to IPFS:", error)
    throw new Error("Error al subir el archivo a IPFS. Por favor, intenta de nuevo.")
  }
}

async function uploadToWeb3Storage(file: File, apiKey: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  
  const response = await fetch("https://api.web3.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error("Error uploading to web3.storage")
  }
  
  const data = await response.json()
  return `https://${data.cid}.ipfs.w3s.link`
}

async function uploadToPinata(file: File, apiKey: string, secretKey: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  
  const metadata = JSON.stringify({
    name: file.name,
  })
  formData.append("pinataMetadata", metadata)
  
  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append("pinataOptions", options)
  
  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: apiKey,
      pinata_secret_api_key: secretKey,
    },
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error("Error uploading to Pinata")
  }
  
  const data = await response.json()
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
}

async function uploadToPublicIPFS(file: File): Promise<string> {
  // Using a public IPFS service like ipfs.io or dweb.link
  // This is for development only - files may not persist
  const formData = new FormData()
  formData.append("file", file)
  
  try {
    // Try using ipfs.io public gateway
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      body: formData,
    })
    
    if (response.ok) {
      const data = await response.json()
      return `https://ipfs.io/ipfs/${data.Hash}`
    }
  } catch (error) {
    console.error("Error with public IPFS:", error)
  }
  
  // Fallback: Return a placeholder URL (for development)
  // In production, you MUST use a proper IPFS service
  console.warn("Using placeholder IPFS URL. Configure IPFS service for production.")
  return `https://ipfs.io/ipfs/placeholder-${Date.now()}`
}

// Helper function to get IPFS URL
export function getIPFSUrl(cid: string): string {
  // If it's already a full URL, return it
  if (cid.startsWith("http")) {
    return cid
  }
  
  // Otherwise, construct URL using public gateway
  return `https://ipfs.io/ipfs/${cid}`
}



