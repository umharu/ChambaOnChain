"use client"

import { useState, useEffect } from "react"
import { createWalletClient, custom, getAddress, type Address } from "viem"

type WalletState = {
  address: Address | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  // Verificar si ya hay una conexión previa
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })
          if (accounts && accounts.length > 0) {
            const address = getAddress(accounts[0])
            setState({
              address,
              isConnected: true,
              isConnecting: false,
              error: null,
            })
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()

    // Escuchar cambios de cuenta
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setState({
            address: null,
            isConnected: false,
            isConnecting: false,
            error: null,
          })
        } else {
          const address = getAddress(accounts[0])
          setState({
            address,
            isConnected: true,
            isConnecting: false,
            error: null,
          })
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask no está instalado. Por favor, instala MetaMask para continuar.",
      }))
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
      })

      const [account] = await walletClient.requestAddresses()
      const address = getAddress(account)

      setState({
        address,
        isConnected: true,
        isConnecting: false,
        error: null,
      })
    } catch (error: any) {
      setState({
        address: null,
        isConnected: false,
        isConnecting: false,
        error: error?.message || "Error al conectar la billetera",
      })
    }
  }

  const disconnect = () => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    })
  }

  return {
    ...state,
    connect,
    disconnect,
  }
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, handler: (accounts: string[]) => void) => void
      removeListener: (event: string, handler: (accounts: string[]) => void) => void
    }
  }
}

