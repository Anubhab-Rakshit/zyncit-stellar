"use client"

import { useEffect, useState } from "react"

interface LoadingAnimationProps {
  onComplete: () => void
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 3000
    const interval = 30
    const steps = duration / interval

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const newProgress = (currentStep / steps) * 100

      setProgress(newProgress)

      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(onComplete, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle-drift"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: ["#3b82f6", "#0284c7", "#06b6d4"][Math.floor(Math.random() * 3)],
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: Math.random() * 4 + "s",
            }}
          />
        ))}
      </div>

      {/* Central loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* ZYNC Logo with enhanced animation */}
        <div
          className="relative w-40 h-40 flex items-center justify-center animate-breathe"
          style={{
            animation: "breathe 3s ease-in-out infinite",
          }}
        >
          <img
            src="/logo.png"
            alt="ZYNC"
            className="w-32 h-32 drop-shadow-[0_0_60px_rgba(59,130,246,0.6)]"
            style={{
              filter: "drop-shadow(0 0 60px rgba(59,130,246,0.6)) drop-shadow(0 0 30px rgba(2,132,199,0.4))",
            }}
          />
        </div>

        <div className="text-center space-y-4">
          <h2
            className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-black tracking-wider"
            style={{
              letterSpacing: "0.15em",
              background: "linear-gradient(135deg, #3b82f6 0%, #0284c7 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
            }}
          >
            ZYNC
          </h2>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3b82f6] via-[#0284c7] to-[#06b6d4] transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)",
              }}
            />
          </div>

          {/* Percentage counter */}
          <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#3b82f6]">
            {Math.round(progress)}%
          </div>

          {/* Loading text */}
          <div className="text-sm text-gray-500 font-mono">
            Initializing Network...
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 via-transparent to-[#0284c7]/5 pointer-events-none" />
    </div>
  )
}
