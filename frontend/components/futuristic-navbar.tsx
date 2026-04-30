"use client"

import {
  Home,
  Search,
  LogIn,
  Menu,
  X,
  LayoutDashboard,
  Library,
  Upload,
  WalletIcon,
  LogOut,
  UserCircle,
  ImageIcon,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function FuturisticNavbar() {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAuthenticated, address, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const iconButtons = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ImageIcon, label: "Gallery", href: "/gallery" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Library, label: "Content", href: "/content" },
    { icon: Upload, label: "Upload", href: "/upload" },
    { icon: WalletIcon, label: "Wallet", href: "/wallet" },
    { icon: UserCircle, label: "Profile", href: "/profile" },
    { icon: Search, label: "Search", href: "/search" },
  ]

  return (
    <>
      <nav className={"fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 transition-all duration-500 " + (isScrolled ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent")}>
        <div className="max-w-7xl mx-auto">
          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo.png" alt="ZYNC" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
                ZYNC
              </span>
            </Link>

            {/* Centered navigation icons */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              {iconButtons.map((button, i) => (
                <Link
                  key={i}
                  href={button.href}
                  className="group relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-transparent hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
                  onMouseEnter={() => setHoveredIcon(i)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  aria-label={button.label}
                >
                  <button.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />

                  {hoveredIcon === i && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-md bg-gray-800 border border-gray-700 text-xs font-medium text-white whitespace-nowrap animate-in fade-in slide-in-from-top-1 duration-200">
                      {button.label}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  {/* Show wallet address */}
                  <div className="px-4 py-2 rounded-full border border-gray-800 bg-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs md:text-sm font-mono text-gray-300">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={logout}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-sm">Sign In</span>
                  </Link>

            
                </>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ZYNC" className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-white">
                ZYNC
              </span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors z-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 md:hidden animate-in slide-in-from-right duration-300 bg-[#0a0a0a] border-l border-gray-800 shadow-2xl">
            <div className="h-full p-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-2xl font-bold tracking-tight text-white">ZYNC</div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Navigation */}
              <div className="space-y-2 mb-8">
                {iconButtons.map((button, i) => (
                  <Link
                    key={i}
                    href={button.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 group"
                  >
                    <button.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-gray-300 group-hover:text-white font-medium transition-colors">{button.label}</span>
                  </Link>
                ))}
              </div>

              <div className="h-px bg-gray-800 mb-8" />

              {/* Auth buttons */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    {/* Show wallet address */}
                    <div className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-mono text-gray-300">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                    </div>

                    {/* Logout button */}
                    <button onClick={logout} className="w-full py-4 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <LogOut className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300 font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>

                    <button className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#111] border border-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors">
                      <UserPlus className="w-5 h-5" />
                      <span>Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
