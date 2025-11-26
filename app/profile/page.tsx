"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/Navigation"
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton"
import { FileList } from "@/components/FileList"
import { useRequireWallet } from "@/lib/hooks/useRequireWallet"
import { getStudentProfile, updateStudentProfile, type StudentProfile } from "@/lib/studentProfile"
import { User, Github, Linkedin, Globe, Mail, Save, Edit2 } from "lucide-react"
import Link from "next/link"
import type { Address } from "viem"

export default function ProfilePage() {
  const router = useRouter()
  const { address, isConnected, isConnecting, canAccess } = useRequireWallet("/login")
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    github: "",
    linkedin: "",
    portfolio: "",
    email: ""
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!canAccess || !address) return

    const savedProfile = getStudentProfile(address)
    if (savedProfile) {
      setProfile(savedProfile)
      setFormData({
        description: savedProfile.description || "",
        github: savedProfile.github || "",
        linkedin: savedProfile.linkedin || "",
        portfolio: savedProfile.portfolio || "",
        email: savedProfile.email || ""
      })
    } else {
      // Initialize with address
      setProfile({ address })
    }
  }, [address, canAccess])

  const handleSave = () => {
    if (!address) return

    setSaving(true)
    const success = updateStudentProfile(address, {
      address,
      ...formData
    })

    if (success) {
      const updated = getStudentProfile(address)
      setProfile(updated)
      setIsEditing(false)
    }
    setSaving(false)
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        description: profile.description || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        portfolio: profile.portfolio || "",
        email: profile.email || ""
      })
    }
    setIsEditing(false)
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
            <p className="text-[#1e3a5f]/60">Necesitas conectar tu wallet para ver tu perfil</p>
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1e3a5f]">Mi Perfil</h1>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>

          {/* Wallet Address */}
          <div className="mb-6 p-4 bg-[#cdeaf9] rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-[#1e3a5f]" />
              <div>
                <p className="text-sm text-[#1e3a5f]/60">Dirección de Wallet</p>
                <p className="text-base font-mono font-medium text-[#1e3a5f]">
                  {address}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-[#1e3a5f]">
                  Sobre mí / Descripción
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Escribe una breve descripción sobre ti, tus habilidades y objetivos..."
                  className="w-full mt-2 p-3 border-2 border-gray-200 rounded-lg focus:border-[#cdeaf9] focus:ring-[#cdeaf9] min-h-[120px]"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github" className="text-[#1e3a5f] flex items-center">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/tuusuario"
                    className="mt-2 border-2 border-gray-200 focus:border-[#cdeaf9]"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin" className="text-[#1e3a5f] flex items-center">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/tuusuario"
                    className="mt-2 border-2 border-gray-200 focus:border-[#cdeaf9]"
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio" className="text-[#1e3a5f] flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Portfolio
                  </Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://tuportfolio.com"
                    className="mt-2 border-2 border-gray-200 focus:border-[#cdeaf9]"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#1e3a5f] flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="mt-2 border-2 border-gray-200 focus:border-[#cdeaf9]"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#f37133] hover:bg-[#f37133]/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-[#1e3a5f] text-[#1e3a5f]"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Description */}
              {profile?.description && (
                <div>
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Sobre mí</h3>
                  <p className="text-[#1e3a5f]/80 leading-relaxed whitespace-pre-wrap">
                    {profile.description}
                  </p>
                </div>
              )}

              {/* Links */}
              {(profile?.github || profile?.linkedin || profile?.portfolio || profile?.email) && (
                <div>
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Enlaces</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-[#1e3a5f] transition-colors"
                      >
                        <Github className="w-5 h-5 text-[#1e3a5f]" />
                        <span className="text-[#1e3a5f] hover:underline">{profile.github}</span>
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-[#1e3a5f] transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-[#1e3a5f]" />
                        <span className="text-[#1e3a5f] hover:underline">{profile.linkedin}</span>
                      </a>
                    )}
                    {profile.portfolio && (
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-[#1e3a5f] transition-colors"
                      >
                        <Globe className="w-5 h-5 text-[#1e3a5f]" />
                        <span className="text-[#1e3a5f] hover:underline">{profile.portfolio}</span>
                      </a>
                    )}
                    {profile.email && (
                      <div className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg">
                        <Mail className="w-5 h-5 text-[#1e3a5f]" />
                        <span className="text-[#1e3a5f]">{profile.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!profile?.description && !profile?.github && !profile?.linkedin && !profile?.portfolio && !profile?.email && (
                <div className="text-center py-8 text-[#1e3a5f]/60">
                  <p>No hay información de perfil. Haz clic en "Editar" para agregar tu descripción y enlaces.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Mi Portfolio</h2>
          <FileList userAddress={address as Address} title="Trabajos subidos" />
        </div>
      </main>
    </div>
  )
}
