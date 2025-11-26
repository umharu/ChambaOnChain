"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/hooks/useWallet"
import { User, Briefcase, FileText, LogOut, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navigation() {
  const { address, isConnected, disconnect } = useWallet()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    disconnect()
    router.push("/")
  }

  if (!isConnected) {
    return null
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Mi Perfil", icon: User },
    { href: "/jobs", label: "Trabajos", icon: Briefcase },
    { href: "/applications", label: "Mis Aplicaciones", icon: FileText },
  ]

  return (
    <nav className="bg-white border-b-2 border-[#1e3a5f]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold font-heading text-[#f37133]">CHAMBA</span>
            <span className="text-xl font-bold font-heading text-[#1e3a5f]">ON CHAIN</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "text-[#f37133] bg-[#cdeaf9]"
                        : "text-[#1e3a5f]/60 hover:text-[#1e3a5f] hover:bg-[#cdeaf9]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-[#1e3a5f]/60">
              {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#1e3a5f] text-[#1e3a5f]"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

