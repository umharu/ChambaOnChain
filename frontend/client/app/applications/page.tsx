"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/Navigation"
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton"
import { getApplicationsWithJobs, type Application } from "@/lib/jobApplications"
import { useRequireWallet } from "@/lib/hooks/useRequireWallet"
import { FileText, Calendar, CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function ApplicationsPage() {
  const { address, isConnected, isConnecting, canAccess } = useRequireWallet("/login")
  const [applications, setApplications] = useState<Application[]>([])

  const loadApplications = () => {
    if (!canAccess || !address) return

    const apps = getApplicationsWithJobs(address)
    // Sort by date (newest first)
    apps.sort((a, b) => b.appliedAt - a.appliedAt)
    setApplications(apps)
  }

  useEffect(() => {
    if (!canAccess) return

    loadApplications()
  }, [canAccess, address])

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "Applied":
        return <Clock className="w-5 h-5 text-blue-500" />
      case "In Review":
        return <RefreshCw className="w-5 h-5 text-yellow-500" />
      case "Accepted":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700"
      case "In Review":
        return "bg-yellow-100 text-yellow-700"
      case "Accepted":
        return "bg-green-100 text-green-700"
      case "Rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
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
            <p className="text-[#1e3a5f]/60">Necesitas conectar tu wallet para ver tus aplicaciones</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1e3a5f] flex items-center">
              <FileText className="w-8 h-8 mr-3 text-[#f37133]" />
              Mis Aplicaciones
            </h1>
            <Button
              onClick={loadApplications}
              variant="outline"
              className="border-[#1e3a5f] text-[#1e3a5f]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-[#1e3a5f]/40 mx-auto mb-4" />
              <p className="text-lg font-medium text-[#1e3a5f] mb-2">
                No has aplicado a ningún trabajo aún
              </p>
              <p className="text-sm text-[#1e3a5f]/60 mb-4">
                Explora las oportunidades disponibles y aplica a los trabajos que te interesen
              </p>
              <Link href="/jobs">
                <Button className="bg-[#f37133] hover:bg-[#f37133]/90 text-white">
                  Ver Trabajos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#1e3a5f] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">
                        {application.job?.title || "Trabajo no encontrado"}
                      </h3>
                      <p className="text-lg font-semibold text-[#f37133] mb-2">
                        {application.job?.company || "Empresa desconocida"}
                      </p>
                      {application.job?.description && (
                        <p className="text-[#1e3a5f]/70 line-clamp-2 mb-3">
                          {application.job.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusIcon(application.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status === "Applied" ? "Aplicado" : 
                         application.status === "In Review" ? "En Revisión" :
                         application.status === "Accepted" ? "Aceptado" :
                         application.status === "Rejected" ? "Rechazado" :
                         application.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-[#1e3a5f]/60">
                      <Calendar className="w-4 h-4" />
                      <span>Aplicado el {formatDate(application.appliedAt)}</span>
                    </div>
                    {application.job && (
                      <Link href="/jobs">
                        <Button variant="outline" size="sm" className="border-[#1e3a5f] text-[#1e3a5f]">
                          Ver Detalles
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
