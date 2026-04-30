"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Upload, Save, RotateCcw, CheckCircle, AlertCircle, User, Mail, FileText, ImageIcon, ExternalLink } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { resolveMediaUrl } from "@/lib/media"
interface ProfileData {
  name: string
  email: string
  avatar: string
  bio: string
  banner: string
  accentColor: string
  showcaseTitle: string
}

interface OwnedNFT {
  _id: string
  name: string
  description: string
  imageURL: string
  tokenId: string
  txHash: string
  createdAt: string
}

export default function ProfilePage() {
  const { isAuthenticated, token, address, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    banner: "",
    accentColor: "#3b82f6",
    showcaseTitle: "My Creation Vault",
  })
  const [initialData, setInitialData] = useState<ProfileData>({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    banner: "",
    accentColor: "#3b82f6",
    showcaseTitle: "My Creation Vault",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [ownedNfts, setOwnedNfts] = useState<OwnedNFT[]>([])
  const [nftsLoading, setNftsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!address) return

      try {
        const response = await fetch(`/api/user/profile/${address}`)
        const data = await response.json()

        if (data.success && data.user) {
          const profileData = {
            name: data.user.name || "",
            email: data.user.email || "",
            avatar: data.user.avatar || "",
            bio: data.user.bio || "",
            banner: data.user.banner || "",
            accentColor: data.user.accentColor || "#3b82f6",
            showcaseTitle: data.user.showcaseTitle || "My Creation Vault",
          }
          setFormData(profileData)
          setInitialData(profileData)
          setCharCount(data.user.bio?.length || 0)
          setAvatarPreview(data.user.avatar || "")
        }
      } catch (error) {
        console.error("[v0] Failed to fetch profile:", error)
      }
    }

    if (isAuthenticated && address) {
      fetchProfileData()
    }
  }, [isAuthenticated, address])

  useEffect(() => {
    const fetchOwnedNfts = async () => {
      if (!isAuthenticated || !token) {
        setOwnedNfts([])
        setNftsLoading(false)
        return
      }

      try {
        setNftsLoading(true)
        const response = await fetch("/api/nfts/my-nfts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (response.ok && data.success) {
          setOwnedNfts(data.data || [])
        } else {
          setOwnedNfts([])
        }
      } catch (_error) {
        setOwnedNfts([])
      } finally {
        setNftsLoading(false)
      }
    }

    fetchOwnedNfts()
  }, [isAuthenticated, token])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, isLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "bio") {
      setCharCount(value.length)
    }
    if (name === "avatar") {
      setAvatarPreview(value)
      setAvatarFile(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file)
    } else {
      setError("Please drop a valid image file")
    }
  }

  const handleFileSelect = (file: File) => {
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleReset = () => {
    setFormData(initialData)
    setCharCount(initialData.bio.length)
    setAvatarPreview(initialData.avatar)
    setAvatarFile(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let avatarUrl = formData.avatar

      if (avatarFile) {
        const form = new FormData()
        form.append("file", avatarFile)
        const uploadResponse = await fetch("/api/upload/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        })

        const uploadData = await uploadResponse.json()
        if (!uploadResponse.ok || !uploadData?.imageURL) {
          throw new Error(uploadData?.error || "Avatar upload failed")
        }

        avatarUrl = uploadData.imageURL
      }

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setInitialData(formData)
      setFormData((prev) => ({ ...prev, avatar: avatarUrl }))
      setAvatarPreview(avatarUrl)

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0a0a]">
      <FuturisticNavbar />

      <div className="max-w-6xl mx-auto mb-12 text-center animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Profile Settings
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Manage your personal information and preferences.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-[#111]">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-mono text-gray-300">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="mb-8 rounded-2xl border border-gray-800 bg-[#111] p-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Profile Preview</p>
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            <div
              className="h-28 w-full"
              style={{
                backgroundImage: `linear-gradient(135deg, ${formData.accentColor}66, #0a0a0f), url('${resolveMediaUrl(formData.banner)}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="-mt-10 flex items-end gap-4 p-4 md:p-6">
              <img
                src={resolveMediaUrl(avatarPreview || formData.avatar)}
                alt="Preview avatar"
                className="h-20 w-20 rounded-full border-4 border-gray-900 object-cover bg-[#111]"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">{formData.name || "Your Name"}</h3>
                <p className="text-sm text-gray-400">{formData.showcaseTitle || "My Creation Vault"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Profile Avatar</h2>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-square w-40 mx-auto mb-6 cursor-pointer transition-colors rounded-full border-2 border-dashed ${
                  isDragging ? "border-white bg-gray-800" : "border-gray-700 hover:border-gray-500 bg-[#161616]"
                } flex items-center justify-center overflow-hidden`}
              >
                {avatarPreview ? (
                  <img
                    src={resolveMediaUrl(avatarPreview)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-500" />
                )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-white mb-2" />
                    <span className="text-xs text-white font-mono">Drop image or click</span>
                  </div>
                {isDragging && (
                  <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">Drop to upload</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="Or enter avatar URL (IPFS/https)"
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 text-sm focus:border-gray-500 outline-none transition-colors"
              />
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Display Name</h2>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your display name"
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-500 outline-none transition-colors"
              />
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Banner URL</h2>
              </div>
              <input
                type="text"
                name="banner"
                value={formData.banner}
                onChange={handleInputChange}
                placeholder="https://... or ipfs://..."
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Email Address</h2>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-500 outline-none transition-colors"
              />
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Showcase Title</h2>
              </div>
              <input
                type="text"
                name="showcaseTitle"
                value={formData.showcaseTitle}
                onChange={handleInputChange}
                placeholder="My Creation Vault"
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-500 outline-none transition-colors"
              />
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Accent Color</h2>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleInputChange}
                  className="h-12 w-14 rounded-xl border border-gray-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 font-mono focus:border-gray-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Bio</h2>
                </div>
                <span className={`text-xs font-medium ${charCount > 200 ? "text-red-400" : "text-gray-500"}`}>
                  {charCount}/250
                </span>
              </div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell the world about yourself..."
                maxLength={250}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-gray-500 outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      <section className="max-w-6xl mx-auto mt-16 border-t border-gray-800 pt-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Owned NFTs</h2>
            <p className="text-sm text-gray-400">Everything this profile currently owns.</p>
          </div>
          <div className="text-sm font-medium text-gray-400">{ownedNfts.length} items</div>
        </div>

        {nftsLoading ? (
          <div className="rounded-2xl border border-gray-800 bg-[#111] p-12 text-center text-gray-400">Loading owned NFTs...</div>
        ) : ownedNfts.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-[#111] p-12 text-center text-gray-400">No owned NFTs yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedNfts.map((nft) => (
              <article
                key={nft._id}
                className="group rounded-2xl border border-gray-800 bg-[#111] p-4 transition-colors hover:border-gray-600 hover:bg-[#161616]"
              >
                <div className="mb-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-900 aspect-square">
                  <img
                    src={resolveMediaUrl(nft.imageURL)}
                    alt={nft.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-white truncate">{nft.name}</h3>
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">{nft.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span className="font-mono">Token #{nft.tokenId}</span>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${nft.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                  >
                    Tx
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showSuccess && (
        <div className="fixed bottom-6 right-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-md z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="font-medium text-green-400">Profile updated successfully.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 right-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-md z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="font-medium text-red-400">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
