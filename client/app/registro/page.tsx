"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({
    nombre: false,
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
      nombre: !formData.nombre,
      email: !formData.email || !formData.email.includes("@"),
      password: !formData.password || formData.password.length < 6,
    }
    setErrors(newErrors)

    if (!Object.values(newErrors).some((error) => error) && formData.acceptTerms) {
      console.log("Formulario válido:", formData)
    }
  }

  const isFormValid = formData.nombre && formData.email && formData.password && formData.acceptTerms

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

      {/* Right Side - Registration Form */}
      <div className="bg-white flex items-center justify-center p-6 lg:w-1/2 lg:min-h-screen">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
              <span className="text-xl font-bold font-heading text-[#f37133]">CHAMBA</span>
              <span className="text-xl font-bold font-heading text-[#1e3a5f]">ON CHAIN</span>
            </div>
            <h1 className="text-[28px] font-bold font-heading text-[#1e3a5f]">Crear cuenta</h1>
            <p className="text-sm text-[#1e3a5f]/60">Únete a la comunidad y encuentra tu primera oportunidad laboral</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-[#1e3a5f]">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className={`rounded-lg border-2 ${
                  errors.nombre ? "border-red-500" : "border-gray-200"
                } focus:border-[#cdeaf9] focus:ring-[#cdeaf9]`}
              />
              {errors.nombre && <p className="text-xs text-red-500">El nombre es requerido</p>}
            </div>

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
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`rounded-lg border-2 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:border-[#cdeaf9] focus:ring-[#cdeaf9]`}
              />
              {errors.password && (
                <p className="text-xs text-red-500">La contraseña debe tener al menos 6 caracteres</p>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm text-[#1e3a5f]/80 leading-relaxed cursor-pointer">
                Acepto los{" "}
                <Link href="/terminos" className="text-[#f37133] hover:underline">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacidad" className="text-[#f37133] hover:underline">
                  política de privacidad
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-lg h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear cuenta
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-[#1e3a5f]/60">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-[#f37133] hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
