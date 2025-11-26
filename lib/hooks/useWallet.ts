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
    isConnecting: true, // Start as connecting to check initial state
    error: null,
  })

  // Verificar si ya hay una conexión previa
  useEffect(() => {
    const checkConnection = async () => {
      // Set connecting state while checking
      setState(prev => ({ ...prev, isConnecting: true }))
      
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
              isConnecting: false, // Done checking
              error: null,
            })
          } else {
            // No accounts found, but we're done checking
            setState({
              address: null,
              isConnected: false,
              isConnecting: false, // Done checking
              error: null,
            })
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
          setState({
            address: null,
            isConnected: false,
            isConnecting: false, // Done checking (with error)
            error: null,
          })
        }
      } else {
        // No ethereum provider, done checking
        setState({
          address: null,
          isConnected: false,
          isConnecting: false,
          error: null,
        })
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
      // Get chain from environment or default to sepolia
      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
      let chain: any = undefined
      
      if (chainId === "11155111" || !chainId) {
        chain = {
          id: 11155111,
          name: "Sepolia",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: { http: ["https://rpc.sepolia.org"] },
          },
        }
      } else if (chainId === "31337") {
        chain = {
          id: 31337,
          name: "Localhost",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: { http: ["http://127.0.0.1:8545"] },
          },
        }
      }

      const walletClient = createWalletClient({
        chain: chain,
        transport: custom(window.ethereum),
      })

      const accounts = await walletClient.requestAddresses()
      if (!accounts || accounts.length === 0) {
        throw new Error("No se pudieron obtener las cuentas de la wallet")
      }
      
      const account = accounts[0]
      if (!account) {
        throw new Error("No se pudo obtener la cuenta de la wallet")
      }
      
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

