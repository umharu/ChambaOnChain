"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"

/**
 * Hook to protect routes that require a connected wallet
 * 
 * Handles redirects properly by:
 * 1. Not redirecting while wallet state is still loading
 * 2. Only redirecting when we're certain the user is not connected
 * 3. Preventing redirect loops
 */
export function useRequireWallet(redirectTo: string = "/login") {
  const router = useRouter()
  const { address, isConnected, isConnecting } = useWallet()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Don't do anything while we're still checking the connection
    if (isConnecting) {
      return
    }

    // If user becomes connected, reset redirect flag
    if (isConnected && address) {
      setHasRedirected(false)
      return
    }

    // Only redirect if we're certain the user is not connected
    // and we haven't already redirected (prevent loops)
    if (!isConnected && !address && !hasRedirected) {
      setHasRedirected(true)
      router.replace(redirectTo)
    }
  }, [isConnected, address, isConnecting, redirectTo, router, hasRedirected])

  return {
    address,
    isConnected,
    isConnecting,
    // Helper to check if we should show content
    canAccess: isConnected && !!address,
  }
}

