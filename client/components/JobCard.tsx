"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2 } from "lucide-react"
import { type Job, hasApplied, applyToJob } from "@/lib/jobApplications"
import { useWallet } from "@/lib/hooks/useWallet"
import { useState, useEffect } from "react"

interface JobCardProps {
  job: Job
  onApply?: () => void
}

export function JobCard({ job, onApply }: JobCardProps) {
  const { address, isConnected } = useWallet()
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  // Check if already applied
  useEffect(() => {
    if (address && isConnected) {
      setApplied(hasApplied(address, job.id))
    }
  }, [address, isConnected, job.id])

  const handleApply = () => {
    if (!address || !isConnected) {
      alert("Por favor, conecta tu wallet para aplicar")
      return
    }

    if (applied) {
      alert("Ya has aplicado a este trabajo")
      return
    }

    setApplying(true)
    const success = applyToJob(address, job)
    
    if (success) {
      setApplied(true)
      if (onApply) {
        onApply()
      }
      alert("¡Aplicación enviada exitosamente!")
    } else {
      alert("Error al aplicar. Ya has aplicado a este trabajo.")
    }
    setApplying(false)
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#f37133] hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{job.title}</h3>
          <p className="text-lg font-semibold text-[#f37133] mb-2">{job.company}</p>
        </div>
        {applied && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Aplicado</span>
          </div>
        )}
      </div>

      <p className="text-[#1e3a5f]/80 mb-4 line-clamp-3">{job.description}</p>

      {/* Job Details */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#1e3a5f]/60">
        {job.location && (
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        )}
        {job.type && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{job.type}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">Requisitos:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#1e3a5f]/70">
            {job.requirements.slice(0, 3).map((req, index) => (
              <li key={index}>{req}</li>
            ))}
            {job.requirements.length > 3 && (
              <li className="text-[#1e3a5f]/50">+{job.requirements.length - 3} más...</li>
            )}
          </ul>
        </div>
      )}

      {/* Apply Button */}
      <Button
        onClick={handleApply}
        disabled={applied || applying || !isConnected}
        className={`w-full ${
          applied
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-[#f37133] hover:bg-[#f37133]/90 text-white"
        }`}
      >
        <Briefcase className="w-4 h-4 mr-2" />
        {applying ? "Aplicando..." : applied ? "Ya aplicaste" : "Aplicar"}
      </Button>
    </div>
  )
}

