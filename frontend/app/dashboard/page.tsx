"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/Navigation"
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton"
import { FileUpload } from "@/components/FileUpload"
import { FileList } from "@/components/FileList"
import { AccessManagement } from "@/components/AccessManagement"
import { useRequireWallet } from "@/lib/hooks/useRequireWallet"
import { Upload, FileText, Users } from "lucide-react"
import Link from "next/link"
import type { Address } from "viem"

export default function DashboardPage() {
  const { address, isConnected, isConnecting, canAccess } = useRequireWallet("/login")
  const [activeTab, setActiveTab] = useState<"upload" | "files" | "access">("upload")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
    setActiveTab("files")
  }

  // Show loading state while checking wallet connection
  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#cdeaf9]">
        <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-lg">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f37133] mx-auto"></div>
            <p className="text-[#1e3a5f]/60">Verificando conexión de wallet...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show connect wallet screen if not connected (hook will handle redirect)
  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#cdeaf9]">
        <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-lg">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Conecta tu wallet</h2>
            <p className="text-[#1e3a5f]/60">Necesitas conectar tu wallet para acceder al dashboard</p>
            <ConnectWalletButton />
            <Link href="/login">
              <Button variant="outline" className="w-full border-[#1e3a5f] text-[#1e3a5f]">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#cdeaf9]">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-6">Mi Portfolio</h1>

          {/* Tabs */}
          <div className="border-b-2 border-gray-200 mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "upload"
                    ? "border-[#f37133] text-[#f37133]"
                    : "border-transparent text-[#1e3a5f]/60 hover:text-[#1e3a5f]"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Subir archivo
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "files"
                    ? "border-[#f37133] text-[#f37133]"
                    : "border-transparent text-[#1e3a5f]/60 hover:text-[#1e3a5f]"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Mis trabajos
              </button>
              <button
                onClick={() => setActiveTab("access")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "access"
                    ? "border-[#f37133] text-[#f37133]"
                    : "border-transparent text-[#1e3a5f]/60 hover:text-[#1e3a5f]"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Gestión de acceso
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "upload" && <FileUpload onUploadSuccess={handleUploadSuccess} />}
            {activeTab === "files" && (
              <FileList key={refreshKey} userAddress={address as Address} refreshKey={refreshKey} />
            )}
            {activeTab === "access" && <AccessManagement />}
          </div>
        </div>
      </main>
    </div>
  )
}

