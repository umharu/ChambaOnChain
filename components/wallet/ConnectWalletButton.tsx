"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useWallet } from "@/lib/hooks/useWallet"
import { useEffect, useState } from "react"

interface ConnectWalletButtonProps {
  onConnect?: (address: string) => void
  className?: string
}

export function ConnectWalletButton({ onConnect, className }: ConnectWalletButtonProps) {
  const { address, isConnected, isConnecting, error, connect, disconnect } = useWallet()
  const [showError, setShowError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (error) {
      setShowError(true)
      const timer = setTimeout(() => setShowError(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (isConnected && address && onConnect) {
      onConnect(address)
    }
  }, [isConnected, address, onConnect])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          onClick={disconnect}
          variant="outline"
          className={`w-full border-2 border-green-500 text-green-700 hover:bg-green-50 rounded-lg h-12 text-base font-medium ${className || ""}`}
        >
          <Wallet className="w-5 h-5 mr-2" />
          Desconectar: {formatAddress(address)}
        </Button>
        {showError && error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={connect}
        disabled={isConnecting}
        className={`w-full bg-[#f37133] hover:bg-[#f37133]/90 text-white rounded-lg h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      >
        <Wallet className="w-5 h-5 mr-2" />
        {isConnecting ? "Conectando..." : "Conectar con MetaMask"}
      </Button>
      {showError && error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
      {isMounted && typeof window !== "undefined" && !window.ethereum && (
        <p className="text-xs text-[#1e3a5f]/60 text-center">
          MetaMask no detectado.{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f37133] hover:underline"
          >
            Instalar MetaMask
          </a>
        </p>
      )}
    </div>
  )
}

