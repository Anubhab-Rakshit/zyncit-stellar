"use client"

import { useState, useEffect } from "react"
import { Wallet, Upload, TrendingUp, Eye, Zap, MessageSquare, Settings, ImageIcon } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
import WaveGridBackground from "@/components/wave-grid-background"

export default function DashboardPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      <div className="fixed inset-0 bg-[#0a0a0f]">
        <WaveGridBackground />
      </div>

      <div
        className="fixed w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-700 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <FuturisticNavbar />

      <main className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[100vw] overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-16">
            {/* Header with animated gradient text */}
            <h1
              className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-wider mb-16 text-center"
              style={{
                letterSpacing: "0.15em",
                background: "linear-gradient(135deg, #3b82f6 0%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 80px rgba(59, 130, 246, 0.3)",
              }}
            >
              COMMAND CENTER
            </h1>

            <div className="relative">
              {/* Top left quadrant - Main metrics */}
              <div
                className="glass rounded-3xl p-8 mb-8 transform -rotate-1 hover:rotate-0 transition-transform duration-700"
                style={{
                  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(59, 130, 246, 0.2)",
                  backdropFilter: "blur(40px)",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6">
                    <div className="text-6xl md:text-7xl font-black mb-2 bg-gradient-to-r from-[#3b82f6] to-[#0284c7] bg-clip-text text-transparent">
                      $45K
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest">Total Earnings</div>
                    <div className="mt-3 text-[#3b82f6] text-sm font-mono">+12.5% this month</div>
                  </div>

                  <div className="text-center p-6">
                    <div className="text-6xl md:text-7xl font-black mb-2 bg-gradient-to-r from-[#dc2626] to-[#3b82f6] bg-clip-text text-transparent">
                      127K
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest">Total Tokens</div>
                    <div className="mt-3 text-[#dc2626] text-sm font-mono">+8 new today</div>
                  </div>
                </div>
              </div>

              {/* Bottom right - Secondary metrics in staggered layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {[
                  { icon: Eye, value: "2.1M", label: "Reach", color: "#3b82f6" },
                  { icon: Zap, value: "8.4K", label: "Engagement", color: "#dc2626" },
                  { icon: TrendingUp, value: "+24%", label: "Growth", color: "#0284c7" },
                ].map((metric, i) => (
                  <div
                    key={i}
                    className="glass rounded-2xl p-6 group hover:scale-105 transition-all duration-500"
                    style={{
                      transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)`,
                      boxShadow: `0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px ${metric.color}20`,
                    }}
                  >
                    <metric.icon className="w-8 h-8 mb-4" style={{ color: metric.color }} />
                    <div className="text-3xl font-black mb-1" style={{ color: metric.color }}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{metric.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-12 relative h-64 md:h-80">
                {[
                  { icon: Upload, label: "Upload", color: "#3b82f6", x: "10%", y: "20%", delay: "0s", href: "/upload" },
                  {
                    icon: ImageIcon,
                    label: "My NFTs",
                    color: "#dc2626",
                    x: "50%",
                    y: "40%",
                    delay: "0.2s",
                    href: "/my-nfts",
                  },
                  {
                    icon: Wallet,
                    label: "Withdraw",
                    color: "#0284c7",
                    x: "80%",
                    y: "10%",
                    delay: "0.4s",
                    href: "/wallet",
                  },
                  {
                    icon: MessageSquare,
                    label: "Messages",
                    color: "#3b82f6",
                    x: "25%",
                    y: "70%",
                    delay: "0.6s",
                    href: "#",
                  },
                  {
                    icon: Settings,
                    label: "Settings",
                    color: "#dc2626",
                    x: "70%",
                    y: "65%",
                    delay: "0.8s",
                    href: "/profile",
                  },
                ].map((action, i) => (
                  <a
                    key={i}
                    href={action.href}
                    className="absolute group"
                    style={{
                      left: action.x,
                      top: action.y,
                      animation: `float 6s ease-in-out infinite`,
                      animationDelay: action.delay,
                    }}
                  >
                    <div
                      className="glass rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-500 hover:scale-125 hover:-translate-y-4"
                      style={{
                        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${action.color}30`,
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: `${action.color}20`,
                          border: `2px solid ${action.color}60`,
                          boxShadow: `0 0 30px ${action.color}40`,
                        }}
                      >
                        <action.icon className="w-8 h-8" style={{ color: action.color }} />
                      </div>
                      <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {action.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
