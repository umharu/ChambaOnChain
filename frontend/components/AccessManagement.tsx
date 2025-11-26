"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, UserMinus, Loader2, Users } from "lucide-react"
import { allowAccess, disallowAccess, getSharedAccess, type Address } from "@/lib/contract"
import { useWallet } from "@/lib/hooks/useWallet"
import { getAddress } from "viem"

interface AccessEntry {
  user: Address
  access: boolean
}

export function AccessManagement() {
  const [accessList, setAccessList] = useState<AccessEntry[]>([])
  const [newUserAddress, setNewUserAddress] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useWallet()

  const loadAccessList = async () => {
    if (!isConnected || !address) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const list = await getSharedAccess(address as Address)
      setAccessList(list as AccessEntry[])
    } catch (err: any) {
      console.error("Error loading access list:", err)
      setError(err.message || "Error al cargar la lista de acceso")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccessList()
  }, [address, isConnected])

  const handleAllowAccess = async () => {
    if (!newUserAddress || !address || !isConnected) return

    try {
      const userAddress = getAddress(newUserAddress)
      setUpdating(true)
      setError(null)

      await allowAccess(address as Address, userAddress)
      setNewUserAddress("")
      await loadAccessList()
    } catch (err: any) {
      console.error("Error allowing access:", err)
      setError(err.message || "Error al otorgar acceso")
    } finally {
      setUpdating(false)
    }
  }

  const handleDisallowAccess = async (userAddress: Address) => {
    if (!address || !isConnected) return

    try {
      setUpdating(true)
      setError(null)

      await disallowAccess(address as Address, userAddress)
      await loadAccessList()
    } catch (err: any) {
      console.error("Error disallowing access:", err)
      setError(err.message || "Error al revocar acceso")
    } finally {
      setUpdating(false)
    }
  }

  const formatAddress = (addr: Address) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-[#1e3a5f]/60">Conecta tu wallet para gestionar el acceso</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#1e3a5f] flex items-center">
        <Users className="w-5 h-5 mr-2" />
        Gestión de acceso
      </h3>

      <div className="border-2 border-gray-200 rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-address" className="text-[#1e3a5f]">
            Dirección de wallet
          </Label>
          <div className="flex space-x-2">
            <Input
              id="user-address"
              type="text"
              placeholder="0x..."
              value={newUserAddress}
              onChange={(e) => setNewUserAddress(e.target.value)}
              className="flex-1 border-2 border-gray-200 focus:border-[#cdeaf9]"
            />
            <Button
              onClick={handleAllowAccess}
              disabled={!newUserAddress || updating}
              className="bg-[#f37133] hover:bg-[#f37133]/90 text-white"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Otorgar acceso
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#1e3a5f]">Usuarios con acceso</p>
          <Button onClick={loadAccessList} variant="outline" size="sm" className="border-[#1e3a5f] text-[#1e3a5f]">
            Actualizar
          </Button>
        </div>

        {loading ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]/40 mx-auto mb-4" />
            <p className="text-[#1e3a5f]/60">Cargando...</p>
          </div>
        ) : accessList.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-[#1e3a5f]/60">No hay usuarios con acceso</p>
          </div>
        ) : (
          <div className="space-y-2">
            {accessList.map((entry, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${entry.access ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm font-medium text-[#1e3a5f]">{formatAddress(entry.user)}</span>
                  <span className={`text-xs px-2 py-1 rounded ${entry.access ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {entry.access ? "Activo" : "Inactivo"}
                  </span>
                </div>
                {entry.access && (
                  <Button
                    onClick={() => handleDisallowAccess(entry.user)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    disabled={updating}
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Revocar
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



