"use client"

import { useEffect, useState } from "react"
import { Hexagon } from "lucide-react"

interface LoadingAnimationProps {
  onComplete: () => void
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(1)

  useEffect(() => {
    const duration = 3000
    const interval = 30
    const steps = duration / interval

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const newProgress = (currentStep / steps) * 100

      setProgress(newProgress)

      if (newProgress >= 33 && phase === 1) setPhase(2)
      if (newProgress >= 66 && phase === 2) setPhase(3)

      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(onComplete, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete, phase])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: ["#3b82f6", "#dc2626", "#0284c7"][Math.floor(Math.random() * 3)],
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: Math.random() * 4 + "s",
              animationDuration: Math.random() * 6 + 8 + "s",
            }}
          />
        ))}
      </div>

      {/* Central loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Phase 1: Hexagon rings forming */}
        <div className="relative w-40 h-40">
          {/* Outer ring */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-transparent transition-all duration-1000 ${
              phase >= 1 ? "border-t-[#3b82f6] border-r-[#dc2626] opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{
              animation: phase >= 1 ? "spin-slow 8s linear infinite" : "none",
              filter: "drop-shadow(0 0 20px #3b82f6)",
            }}
          />

          {/* Middle ring */}
          <div
            className={`absolute inset-6 rounded-full border-3 border-transparent transition-all duration-1000 delay-300 ${
              phase >= 2 ? "border-l-[#0284c7] border-b-[#3b82f6] opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{
              animation: phase >= 2 ? "spin-slow 6s linear infinite reverse" : "none",
              filter: "drop-shadow(0 0 15px #0284c7)",
            }}
          />

          {/* Inner ring */}
          <div
            className={`absolute inset-12 rounded-full border-2 border-transparent transition-all duration-1000 delay-500 ${
              phase >= 3 ? "border-t-[#dc2626] border-l-[#3b82f6] opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{
              animation: phase >= 3 ? "spin-slow 4s linear infinite" : "none",
              filter: "drop-shadow(0 0 10px #dc2626)",
            }}
          />

          {/* Center hexagon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Hexagon
              className={`w-16 h-16 text-[#3b82f6] transition-all duration-1000 ${
                phase >= 2 ? "opacity-100 scale-100 animate-glow-pulse" : "opacity-0 scale-50"
              }`}
              style={{
                filter: "drop-shadow(0 0 30px #3b82f6)",
              }}
            />
          </div>

          {/* Orbiting particles */}
          {phase >= 2 &&
            [0, 120, 240].map((angle, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full animate-fadeInScale"
                style={{
                  background: ["#3b82f6", "#dc2626", "#0284c7"][i],
                  animation: `orbit-${i} 3s linear infinite`,
                  animationDelay: `${i * 0.3}s`,
                  boxShadow: `0 0 10px ${["#3b82f6", "#dc2626", "#0284c7"][i]}`,
                }}
              />
            ))}
        </div>

        <div className="text-center space-y-4">
          <h2
            className="font-[family-name:var(--font-display)] text-5xl font-black tracking-wider"
            style={{
              letterSpacing: "0.15em",
              background: "linear-gradient(135deg, #3b82f6 0%, #0284c7 50%, #dc2626 100%)",
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
              className="h-full bg-gradient-to-r from-[#3b82f6] via-[#0284c7] to-[#dc2626] transition-all duration-300 ease-out"
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

          {/* Phase text */}
          <div className="text-sm text-gray-500 font-mono">
            {phase === 1 && "Initializing Network..."}
            {phase === 2 && "Connecting Nodes..."}
            {phase === 3 && "Entering Metaverse..."}
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 via-transparent to-[#dc2626]/5 pointer-events-none" />
    </div>
  )
}
;<style jsx>{`
  @keyframes orbit-0 {
    from {
      transform: rotate(0deg) translateX(60px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(60px) rotate(-360deg);
    }
  }

  @keyframes orbit-1 {
    from {
      transform: rotate(120deg) translateX(60px) rotate(-120deg);
    }
    to {
      transform: rotate(480deg) translateX(60px) rotate(-480deg);
    }
  }

  @keyframes orbit-2 {
    from {
      transform: rotate(240deg) translateX(60px) rotate(-240deg);
    }
    to {
      transform: rotate(600deg) translateX(60px) rotate(-600deg);
    }
  }
`}</style>
