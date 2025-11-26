"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/Navigation"
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton"
import { JobCard } from "@/components/JobCard"
import { getAllJobs, type Job } from "@/lib/jobApplications"
import { useRequireWallet } from "@/lib/hooks/useRequireWallet"
import { Search, Filter, Briefcase } from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
  const { address, isConnected, isConnecting, canAccess } = useRequireWallet("/login")
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!canAccess) return

    // Load jobs
    const allJobs = getAllJobs()
    setJobs(allJobs)
    setFilteredJobs(allJobs)
  }, [canAccess])

  // Filter and search jobs
  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(job => job.type === filterType)
    }

    setFilteredJobs(filtered)
  }, [searchTerm, filterType, jobs])

  const handleApply = () => {
    // Refresh to update applied status
    const allJobs = getAllJobs()
    setJobs([...allJobs])
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
            <p className="text-[#1e3a5f]/60">Necesitas conectar tu wallet para ver trabajos</p>
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

  const jobTypes = ["all", "Full-time", "Part-time", "Internship"]

  return (
    <div className="min-h-screen bg-[#cdeaf9]">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1e3a5f] flex items-center">
              <Briefcase className="w-8 h-8 mr-3 text-[#f37133]" />
              Oportunidades de Trabajo
            </h1>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-[#1e3a5f] text-[#1e3a5f]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1e3a5f]/40" />
              <Input
                type="text"
                placeholder="Buscar por título, empresa o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-[#cdeaf9]"
              />
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="p-4 bg-[#cdeaf9] rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <Button
                      key={type}
                      onClick={() => setFilterType(type)}
                      variant={filterType === type ? "default" : "outline"}
                      className={
                        filterType === type
                          ? "bg-[#f37133] hover:bg-[#f37133]/90 text-white"
                          : "border-[#1e3a5f] text-[#1e3a5f]"
                      }
                    >
                      {type === "all" ? "Todos" : type}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-[#1e3a5f]/60">
              {filteredJobs.length} {filteredJobs.length === 1 ? "trabajo encontrado" : "trabajos encontrados"}
            </p>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Briefcase className="w-16 h-16 text-[#1e3a5f]/40 mx-auto mb-4" />
            <p className="text-lg font-medium text-[#1e3a5f] mb-2">No se encontraron trabajos</p>
            <p className="text-sm text-[#1e3a5f]/60">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
