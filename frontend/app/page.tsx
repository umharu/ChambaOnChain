"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
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

      {/* Right Side - Welcome Actions */}
      <div className="bg-white flex items-center justify-center p-6 lg:w-1/2 lg:min-h-screen">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex items-center gap-2 justify-center mb-6">
              <span className="text-xl font-bold font-heading text-[#f37133]">CHAMBA</span>
              <span className="text-xl font-bold font-heading text-[#1e3a5f]">ON CHAIN</span>
            </div>
            <h1 className="text-[28px] font-bold font-heading text-[#1e3a5f]">Bienvenido</h1>
            <p className="text-base text-[#1e3a5f]/60 leading-relaxed">
              Únete a la comunidad y encuentra tu primera oportunidad laboral en blockchain
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Link href="/registro" className="block">
              <Button className="w-full bg-[#f37133] hover:bg-[#f37133]/90 text-white rounded-lg h-14 text-base font-medium">
                Crear cuenta
              </Button>
            </Link>

            <Link href="/login" className="block">
              <Button
                variant="outline"
                className="w-full border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-lg h-14 text-base font-medium bg-transparent"
              >
                Iniciar sesión
              </Button>
            </Link>
          </div>

          <div className="text-center pt-6">
            <p className="text-sm text-[#1e3a5f]/60 leading-relaxed">
              Al continuar, aceptas nuestros{" "}
              <Link href="/terminos" className="text-[#f37133] hover:underline">
                términos y condiciones
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
