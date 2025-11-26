"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: false }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      email: !formData.email || !formData.email.includes("@"),
      password: !formData.password,
    }
    setErrors(newErrors)

    if (!Object.values(newErrors).some((error) => error)) {
      console.log("Login válido:", formData)
    }
  }

  const isFormValid = formData.email && formData.password

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="bg-[#cdeaf9] flex flex-col items-center justify-center p-8 lg:w-1/2 lg:min-h-screen">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-6xl font-bold font-heading">
              <span className="text-[#f37133]">CHAMBA</span> <span className="text-[#1e3a5f]">ON</span>
            </h1>
            <h1 className="text-5xl lg:text-6xl font-bold font-heading text-[#1e3a5f] flex items-center justify-center gap-2">
              CHAIN
              <svg className="w-12 h-12 text-[#f37133]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </h1>
          </div>

          <div className="space-y-4 pt-8">
            <h2 className="text-2xl font-semibold font-heading text-[#1e3a5f]">Conecta con oportunidades</h2>
            <p className="text-base text-[#1e3a5f]/80 leading-relaxed">
              la plataforma blockchain para estudiantes que buscan su primera chamba profesional
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-white flex items-center justify-center p-6 lg:w-1/2 lg:min-h-screen">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
              <span className="text-xl font-bold font-heading text-[#f37133]">CHAMBA</span>
              <span className="text-xl font-bold font-heading text-[#1e3a5f]">ON CHAIN</span>
            </div>
            <h1 className="text-[28px] font-bold font-heading text-[#1e3a5f]">Iniciar sesión</h1>
            <p className="text-sm text-[#1e3a5f]/60">Ingresa a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1e3a5f]">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`rounded-lg border-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } focus:border-[#cdeaf9] focus:ring-[#cdeaf9]`}
              />
              {errors.email && <p className="text-xs text-red-500">Ingresa un email válido</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1e3a5f]">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`rounded-lg border-2 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:border-[#cdeaf9] focus:ring-[#cdeaf9]`}
              />
              {errors.password && <p className="text-xs text-red-500">La contraseña es requerida</p>}
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/recuperar-password" className="text-sm text-[#f37133] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-lg h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iniciar sesión
            </Button>

            <div className="space-y-4 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#1e3a5f]/60">O conecta con tu billetera</span>
                </div>
              </div>

              <ConnectWalletButton
                onConnect={(address) => {
                  console.log("Wallet conectada:", address)
                  // Redirect to dashboard after wallet connection
                  window.location.href = "/dashboard"
                }}
              />
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-[#1e3a5f]/60">
                ¿No tienes cuenta?{" "}
                <Link href="/registro" className="text-[#f37133] hover:underline font-medium">
                  Crear cuenta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
