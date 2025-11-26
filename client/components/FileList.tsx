"use client"

import { useState, useEffect } from "react"
import { File, ExternalLink, Loader2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { displayFiles, type Address } from "@/lib/contract"
import { useWallet } from "@/lib/hooks/useWallet"

interface FileListProps {
  userAddress?: Address
  title?: string
  refreshKey?: number
}

export function FileList({ userAddress, title = "Mis trabajos", refreshKey }: FileListProps) {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useWallet()

  const loadFiles = async (retryCount = 0) => {
    if (!isConnected || !address) {
      setLoading(false)
      setError("Conecta tu wallet para ver tus archivos")
      return
    }

    const targetAddress = (userAddress || address) as Address
    setLoading(true)
    setError(null)

    try {
      console.log("=== Loading Files ===")
      console.log("Target address (owner):", targetAddress)
      console.log("Viewer address (msg.sender):", address)
      console.log("Are they the same?", targetAddress.toLowerCase() === address.toLowerCase())
      
      const fileUrls = await displayFiles(targetAddress, address as Address)
      console.log("Files loaded successfully:", fileUrls)
      console.log("Number of files:", fileUrls?.length || 0)
      
      // Filter out empty strings and invalid URLs
      const validFiles = fileUrls.filter(url => url && url.trim() !== "" && url.startsWith("http"))
      console.log("Valid files:", validFiles)
      
      setFiles(validFiles)
      
      if (validFiles.length === 0 && fileUrls.length > 0) {
        console.warn("Some files were filtered out as invalid")
      }
    } catch (err: any) {
      console.error("Error loading files:", err)
      console.error("Error message:", err.message)
      
      // If it's a timeout or access error, retry
      if (retryCount < 3 && (
        err.message?.includes("access") || 
        err.message?.includes("No tienes") ||
        err.message?.includes("No se pudieron cargar") ||
        err.message?.includes("timeout") ||
        err.message?.includes("took too long") ||
        err.message?.includes("Request timed out")
      )) {
        const delay = err.message?.includes("timeout") ? 5000 : 3000
        console.log(`Retrying in ${delay/1000} seconds... (attempt ${retryCount + 1}/3)`)
        setTimeout(() => {
          loadFiles(retryCount + 1)
        }, delay)
        return
      }
      
      // Show user-friendly error message
      setError(err.message || "Error al cargar los archivos. Verifica que hayas subido archivos con esta wallet.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [address, isConnected, userAddress, refreshKey])

  const handleViewFile = (url: string) => {
    window.open(url, "_blank")
  }

  if (!isConnected) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-[#1e3a5f]/60">Conecta tu wallet para ver tus archivos</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]/40 mx-auto mb-4" />
        <p className="text-[#1e3a5f]/60">Cargando archivos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
        <div>
          <p className="text-red-600 font-medium mb-2">{error}</p>
          {address && (
            <p className="text-sm text-[#1e3a5f]/60">
              Tu dirección: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Button onClick={loadFiles} variant="outline" className="border-[#1e3a5f] text-[#1e3a5f]">
            Reintentar
          </Button>
          {error.includes("contrato") && (
            <p className="text-xs text-[#1e3a5f]/60 mt-2">
              Verifica que NEXT_PUBLIC_CONTRACT_ADDRESS esté configurado en .env.local
            </p>
          )}
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <File className="w-16 h-16 text-[#1e3a5f]/40 mx-auto mb-4" />
        <p className="text-lg font-medium text-[#1e3a5f] mb-2">No hay trabajos subidos aún</p>
        <p className="text-sm text-[#1e3a5f]/60">Sube tu primer PDF en la pestaña "Subir archivo"</p>
      </div>
    )
  }

  // Extract filename from URL or use index
  const getFileName = (url: string, index: number) => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const fileName = pathname.split('/').pop() || `Trabajo ${index + 1}`
      // Remove file extension if present
      return fileName.replace(/\.(pdf|PDF)$/, '') || `Trabajo ${index + 1}`
    } catch {
      return `Trabajo ${index + 1}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">{title}</h2>
        <Button onClick={loadFiles} variant="outline" size="sm" className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white">
          Actualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((url, index) => {
          const fileName = getFileName(url, index)
          return (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#f37133] hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewFile(url)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* PDF Icon */}
                <div className="w-16 h-16 bg-[#cdeaf9] rounded-lg flex items-center justify-center group-hover:bg-[#f37133] transition-colors">
                  <File className="w-8 h-8 text-[#1e3a5f] group-hover:text-white transition-colors" />
                </div>
                
                {/* File Name */}
                <div className="w-full">
                  <h3 className="text-base font-semibold text-[#1e3a5f] mb-2 line-clamp-2">
                    {fileName}
                  </h3>
                  <p className="text-xs text-[#1e3a5f]/60 truncate">
                    PDF Document
                  </p>
                </div>
                
                {/* View Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewFile(url)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver PDF
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

