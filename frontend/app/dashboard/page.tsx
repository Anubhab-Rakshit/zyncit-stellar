"use client"

import { useState, useEffect } from "react"
import { Globe, Lock, Rocket, Users } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"

import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Setup scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll("[data-scroll-reveal]")
    elements.forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <>
      <div className="fixed inset-0 bg-[#0a0a0a]" />

      <FuturisticNavbar />

      <main className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[100vw] overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Your creator hub — manage assets, track performance, and grow your audience.</p>
          </div>

          {/* Platform Information Grid - Static, Reliable Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 stagger-children">
            {[
              {
                icon: Globe,
                title: "ZYNC Network",
                description: "Decentralized publishing platform",
                details: "Live on Blockchain",
                color: "#3b82f6",
              },
              {
                icon: Users,
                title: "Creator Community",
                description: "Join thousands of creators",
                details: "Active ecosystem",
                color: "#0284c7",
              },
              {
                icon: Lock,
                title: "Secure Assets",
                description: "Your content is protected",
                details: "Web3 Security",
                color: "#06b6d4",
              },
              {
                icon: Rocket,
                title: "Get Started",
                description: "Monetize your content today",
                details: "Zero setup fees",
                color: "#3b82f6",
              },
            ].map((item, i) => {
              const IconComponent = item.icon
              return (
              <div
                key={i}
                data-scroll-reveal
                id={`platform-card-${i}`}
                className={`group rounded-2xl p-8 border border-gray-800 bg-[#111] transition-all duration-500 hover:border-gray-600 ${
                  visibleElements.has(`platform-card-${i}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-800">
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-gray-800 text-gray-300">
                      {item.details}
                    </span>
                  </div>
                </div>
              </div>
            )})}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 stagger-children">
            {[
              { title: "Upload Content", description: "Publish and tokenize new digital assets", href: "/upload", color: "#3b82f6" },
              { title: "View Analytics", description: "Track performance metrics and reach", href: "/analytics", color: "#0284c7" },
              { title: "Manage Assets", description: "View and manage your NFT portfolio", href: "/my-nfts", color: "#06b6d4" },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                data-scroll-reveal
                id={`action-${i}`}
                className={`group rounded-2xl p-8 border border-gray-800 bg-[#111] transition-all duration-300 hover:border-gray-600 hover:bg-[#161616] cursor-pointer ${
                  visibleElements.has(`action-${i}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-6">
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{action.title}</h3>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                  <span>Access</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>

          {/* Info Section */}
          <div className="rounded-2xl p-8 md:p-12 border border-gray-800 bg-[#111]">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Your ZYNC Hub</h2>
            <p className="text-gray-400 leading-relaxed max-w-4xl">
              Manage your published content and digital assets on the ZYNC platform. View all your tokenized pages, monitor performance metrics, and access real-time analytics. Upload new content, manage your NFT portfolio, and track your growth across the decentralized publishing ecosystem.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
