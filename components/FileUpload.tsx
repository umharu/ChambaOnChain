"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, Loader2 } from "lucide-react"
import { uploadToIPFS } from "@/lib/ipfs"
import { addFile, type Address } from "@/lib/contract"
import { useWallet } from "@/lib/hooks/useWallet"

interface FileUploadProps {
  onUploadSuccess?: () => void
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const { address, isConnected } = useWallet()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Only allow PDF files
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Por favor, selecciona un archivo PDF")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !address || !isConnected) {
      setError("Por favor, conecta tu wallet y selecciona un archivo PDF")
      return
    }

    setUploading(true)
    setError(null)

    try {
      console.log("Starting upload process...")
      console.log("File:", file.name, "Size:", file.size)
      console.log("Wallet address:", address)

      // Step 1: Upload to IPFS
      console.log("Step 1: Uploading to IPFS...")
      const ipfsUrl = await uploadToIPFS(file)
      console.log("✅ File uploaded to IPFS:", ipfsUrl)

      // Step 2: Store IPFS URL in smart contract
      // This will trigger MetaMask to sign the transaction
      console.log("Step 2: Storing IPFS URL on blockchain...")
      console.log("⚠️ MetaMask will open - please sign the transaction")
      
      const txHash = await addFile(address as Address, ipfsUrl)
      console.log("✅ File URL stored in smart contract. Transaction hash:", txHash)

      // Success! (even if timeout occurred, transaction was sent)
      setFile(null)
      setError(null)
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }

      // Show success message with transaction hash
      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"
      const explorerUrl = chainId === "11155111" 
        ? `https://sepolia.etherscan.io/tx/${txHash}`
        : `https://etherscan.io/tx/${txHash}`
      
      console.log("View transaction on Etherscan:", explorerUrl)
      setTxHash(txHash)
      setSuccess(`Archivo subido exitosamente! Transacción: ${txHash.slice(0, 10)}...`)
      
      // Stop loading immediately - transaction is sent
      setUploading(false)

      // Wait a bit for transaction to be confirmed before refreshing file list
      // The transaction is sent but needs time to be mined
      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      }, 5000) // Wait 5 seconds for transaction to be mined
      
      // Clear success message after 15 seconds
      setTimeout(() => {
        setSuccess(null)
        setTxHash(null)
      }, 15000)
    } catch (err: any) {
      console.error("❌ Error uploading file:", err)
      // Better error messages
      if (err.message?.includes("User rejected") || err.message?.includes("denied")) {
        setError("Transacción cancelada. Por favor, intenta de nuevo y firma la transacción en MetaMask.")
      } else if (err.message?.includes("insufficient funds")) {
        setError("Fondos insuficientes. Necesitas ETH para pagar las tarifas de gas.")
      } else if (err.message?.includes("contract")) {
        setError("Error con el contrato. Verifica que la dirección del contrato sea correcta.")
      } else if (err.message?.includes("Timed out") || err.message?.includes("timeout")) {
        // Extract transaction hash from error if available
        const hashMatch = err.message.match(/0x[a-fA-F0-9]{64}/)
        if (hashMatch) {
          const txHash = hashMatch[0]
          const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"
          const explorerUrl = chainId === "11155111" 
            ? `https://sepolia.etherscan.io/tx/${txHash}`
            : `https://etherscan.io/tx/${txHash}`
          setError(`Timeout esperando confirmación, pero la transacción fue enviada. Hash: ${txHash.slice(0, 10)}... Verifica en Etherscan.`)
        } else {
          setError("Timeout esperando confirmación. La transacción puede haberse enviado correctamente. Verifica en Etherscan.")
        }
      } else {
        setError(err.message || "Error al subir el archivo. Por favor, intenta de nuevo.")
      }
    } finally {
      setUploading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-[#1e3a5f]/60">Conecta tu wallet para subir archivos</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-[#1e3a5f]/40" />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-[#1e3a5f]">
              Sube tu archivo PDF
            </p>
            <p className="text-xs text-[#1e3a5f]/60">
              Selecciona un archivo PDF para subir a IPFS y almacenarlo en la blockchain
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <label htmlFor="file-input" className="cursor-pointer">
              <input
                id="file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                className="border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                disabled={uploading}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("file-input")?.click()
                }}
              >
                <File className="w-4 h-4 mr-2" />
                {file ? "Cambiar archivo" : "Seleccionar archivo PDF"}
              </Button>
            </label>
            {!file && (
              <p className="text-xs text-[#1e3a5f]/40">
                Haz clic en el botón para seleccionar un archivo PDF
              </p>
            )}
          </div>
          {file && (
            <div className="mt-4 p-4 bg-[#cdeaf9] rounded-lg w-full max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <File className="w-5 h-5 text-[#1e3a5f] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#1e3a5f] truncate">
                    {file.name}
                  </span>
                </div>
                <span className="text-xs text-[#1e3a5f]/60 ml-2 flex-shrink-0">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {file && (
        <div className="space-y-2">
          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full bg-[#f37133] hover:bg-[#f37133]/90 text-white rounded-lg h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {uploading ? "Subiendo y firmando transacción..." : "Subiendo..."}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Subir a Blockchain y Firmar
              </>
            )}
          </Button>
          {!uploading && (
            <p className="text-xs text-center text-[#1e3a5f]/60">
              ⚠️ MetaMask se abrirá para que firmes la transacción
            </p>
          )}
        </div>
      )}

      {success && txHash && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 font-medium">✅ Éxito:</p>
          <p className="text-sm text-green-600 mt-1">{success}</p>
          <p className="text-xs text-green-600 mt-2">
            Puedes verificar la transacción en{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-700"
            >
              Etherscan
            </a>
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Error:</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          {error.includes("0x") && (
            <p className="text-xs text-red-600 mt-2">
              Puedes verificar la transacción en{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${error.match(/0x[a-fA-F0-9]{64}/)?.[0] || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-red-700"
              >
                Etherscan
              </a>
            </p>
          )}
        </div>
      )}

      {uploading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <p className="text-sm text-blue-600">
              Procesando... Por favor espera y firma la transacción en MetaMask cuando aparezca.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

