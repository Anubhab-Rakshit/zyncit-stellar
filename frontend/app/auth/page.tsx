"use client"

import { useState, useEffect, useRef } from "react"
import { Wallet, ExternalLink, Copy, Check, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { connectWallet, getSupportedWallets, getWalletNetwork, signWalletMessage } from "@/lib/wallet-kit"
import { mapWalletError } from "@/lib/errors"

type AuthStatus =
  | "detect"
  | "connect"
  | "sign"
  | "connecting"
  | "wrong-network"
  | "awaiting-signature"
  | "verifying"
  | "success"
  | "error"

interface Toast {
  id: number
  message: string
  type: "error" | "success"
}

export default function AuthPage() {
  const [hasFreighter, setHasFreighter] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [status, setStatus] = useState<AuthStatus>("detect")
  const [toasts, setToasts] = useState<Toast[]>([])
  const [copiedAddress, setCopiedAddress] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const [walletCount, setWalletCount] = useState(0)


  // Check for Freighter
  useEffect(() => {
    const detectWallets = async () => {
      try {
        if (typeof window === "undefined") return
        const wallets = await getSupportedWallets()
        const available = wallets.filter((wallet) => wallet.isAvailable)
        setWalletCount(available.length)
        setHasFreighter(available.length > 0)
        setStatus(available.length > 0 ? "connect" : "detect")
      } catch (error) {
        console.error("Freighter detection error", error)
        setHasFreighter(false)
        setStatus("detect")
      }
    }
    detectWallets()
  }, [])

  const addToast = (message: string, type: "error" | "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const handleInstall = () => {
    window.open("https://freighter.app/", "_blank")
  }

  const handleConnect = async () => {
    setStatus("connecting")
    try {
      const result = await connectWallet()
      const publicKey = result.address
      
      if (!publicKey) throw new Error("No address returned")

      const walletNetwork = await getWalletNetwork()
      if (walletNetwork.networkPassphrase !== "Test SDF Network ; September 2015") {
        setStatus("wrong-network")
        addToast("Please switch wallet network to Stellar Testnet", "error")
        setTimeout(() => setStatus("connect"), 2000)
        return
      }

      setAddress(publicKey)
      setStatus("sign")
      addToast("Wallet connected!", "success")
    } catch (error) {
      const mapped = mapWalletError(error)
      setStatus("error")
      addToast(mapped.message || "Connection rejected", "error")
      setTimeout(() => setStatus("connect"), 2000)
    }
  }

  const handleSign = async () => {
    setStatus("awaiting-signature")
    try {
      const timestamp = new Date().toISOString()
      const message = `Login verification at ${timestamp}`

      const signResponse = await signWalletMessage(message, address ?? undefined)

      setStatus("verifying")

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: signResponse.signerAddress || address,
          message,
          signature: signResponse.signedMessage,
        }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        login(data.address, data.token)
        setStatus("success")
        addToast("Authentication successful!", "success")

        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        throw new Error(data.message || "Verification failed")
      }
    } catch (error) {
      const mapped = mapWalletError(error)
      setStatus("error")
      addToast(mapped.message || "Signature declined", "error")
      setTimeout(() => setStatus("sign"), 2000)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "detect":
        return "No Wallet Detected"
      case "connect":
        return "Ready to Connect"
      case "connecting":
        return "Connecting..."
      case "sign":
        return "Ready to Sign"
      case "awaiting-signature":
        return "Awaiting Signature..."
      case "verifying":
        return "Verifying..."
      case "wrong-network":
        return "Wrong Network"
      case "success":
        return "Authentication Successful"
      case "error":
        return "Connection Failed"
      default:
        return ""
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Main content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-12">
        {status !== "success" ? (
          /* Authentication panel */
          <div className="w-full max-w-lg">
            {/* Main card */}
            <div className="rounded-2xl border border-gray-800 bg-[#111] p-8 shadow-2xl sm:p-12">
              {/* Logo/Brand */}
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  ZYNC
                </h1>
                <p className="text-sm font-medium text-gray-400">Decentralized Content Platform</p>
              </div>

              {/* Detect State - No Freighter */}
              {status === "detect" && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                    <Wallet className="h-10 w-10 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Install Freighter</h2>
                  <p className="text-sm text-gray-400">
                    You need a Stellar wallet to access ZYNC. Freighter is free and takes less than a minute.
                  </p>

                  <button
                    onClick={handleInstall}
                    className="w-full rounded-xl border border-gray-700 bg-white px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Install Freighter
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </button>

                  <a
                    href="https://stellar.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    What is a wallet? <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Connect State */}
              {status === "connect" && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                    <Wallet className="h-10 w-10 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
                  <p className="text-sm text-gray-400">
                     Connect your Stellar wallet to access your decentralized content universe.
                   </p>

                  <button
                    onClick={handleConnect}
                    className="w-full rounded-xl border border-gray-700 bg-white px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                    aria-label="Connect Stellar wallet"
                  >
                    Connect Wallet ({walletCount})
                  </button>
                </div>
              )}

              {/* Connecting State */}
              {status === "connecting" && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Connecting...</h2>
                  <p className="text-sm text-gray-400">Please check Freighter</p>
                </div>
              )}

              {/* Sign State */}
              {status === "sign" && address && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Sign to Continue</h2>

                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Connected Address</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="flex-1 truncate text-sm text-white font-mono">{address}</code>
                      <button
                        onClick={copyAddress}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:text-white"
                        aria-label="Copy address"
                      >
                        {copiedAddress ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">⛽ Gasless • This only proves wallet ownership</p>

                  <button
                    onClick={handleSign}
                    className="w-full rounded-xl border border-gray-700 bg-white px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
                  >
                    Sign Message
                  </button>
                </div>
              )}

              {/* Awaiting Signature State */}
              {status === "awaiting-signature" && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Awaiting Signature...</h2>
                  <p className="text-sm text-gray-400">Please sign the message in Freighter</p>
                </div>
              )}

              {/* Verifying State */}
              {status === "verifying" && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-800 bg-gray-900">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Verifying...</h2>
                  <p className="text-sm text-gray-400">Confirming your identity</p>
                </div>
              )}

              {/* Error State */}
              {status === "error" && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Connection Failed</h2>
                  <p className="text-sm text-gray-400">Please try again</p>
                </div>
              )}

              {/* Status strip at bottom */}
              <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-center">
                <p className="text-xs font-medium text-gray-500">
                  {getStatusText()}
                  {["connecting", "awaiting-signature", "verifying"].includes(status) && (
                    <span className="ml-1 inline-flex gap-1">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse delay-100">.</span>
                      <span className="animate-pulse delay-200">.</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="w-full max-w-md transform text-center transition-all duration-700">
            <div className="relative mx-auto mb-8 h-24 w-24">
              <div className="absolute inset-0 flex items-center justify-center rounded-full border border-gray-800 bg-[#111]">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>

            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">
              Welcome to ZYNC
            </h2>
            <p className="mb-8 text-gray-400 font-medium">Authentication successful</p>

            <a
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-700 bg-white px-8 py-4 font-semibold text-black transition-colors hover:bg-gray-200"
            >
              Enter Dashboard
            </a>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-[slideIn_0.3s_ease-out] rounded-xl border px-6 py-4 shadow-xl ${
              toast.type === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-500"
                : "border-green-500/30 bg-green-500/10 text-green-500"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
