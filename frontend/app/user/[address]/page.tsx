"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Calendar, ExternalLink } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { getBackendApiBaseUrl } from "@/lib/backend-url"
import { resolveMediaUrl } from "@/lib/media"

interface User {
  _id: string
  address: string
  name: string
  avatar: string
  bio: string
  email?: string
  banner?: string
  accentColor?: string
  showcaseTitle?: string
  createdAt: string
}

interface NFT {
  _id: string
  name: string
  description: string
  imageURL: string
  tokenId: string
  createdAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const address = params.address as string

  const [user, setUser] = useState<User | null>(null)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile
        const backendUrl = getBackendApiBaseUrl()
        const profileResponse = await fetch(`${backendUrl}/api/wallet/profile/${address}`)
        const profileData = await profileResponse.json()

        if (profileData.success) {
          setUser(profileData.user)
        }

        // Fetch all NFTs and filter by owner
        const nftsResponse = await fetch("/api/nfts/all")
        const nftsData = await nftsResponse.json()

        if (nftsData.success) {
          const userNFTs = nftsData.data.filter((nft: NFT & { owner: string }) => nft.owner === address)
          setNfts(userNFTs)
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [address])

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a]">
        <FuturisticNavbar />
        <main className="relative min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white mb-4" />
            <p className="font-medium">Loading profile...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a]">
        <FuturisticNavbar />
        <main className="relative min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-400 font-medium">
            <p>User not found</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <FuturisticNavbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="rounded-2xl border border-gray-800 bg-[#111] mb-12 overflow-hidden">
            <div
              className="h-40 w-full"
              style={{
                backgroundImage: `linear-gradient(135deg, ${user.accentColor || "#3b82f6"}66, #0a0a0f), url('${resolveMediaUrl(user.banner)}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-900 bg-[#111] flex-shrink-0 -mt-24">
                {user.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-1">{user.name}</h1>
                <p className="text-sm font-medium mb-3 text-gray-400">
                  {user.showcaseTitle || "My Creation Vault"}
                </p>
                <p className="text-gray-500 font-mono text-sm mb-4">
                  {user.address.slice(0, 10)}...{user.address.slice(-8)}
                </p>
                {user.bio && <p className="text-gray-300 mb-6">{user.bio}</p>}

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ExternalLink className="w-4 h-4" />
                    {nfts.length} NFTs
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* NFTs Grid */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-8 border-t border-gray-800 pt-8">{user.showcaseTitle || "Created NFTs"}</h2>

            {nfts.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <p>No NFTs created yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft, index) => (
                  <div
                    key={nft._id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative rounded-2xl border border-gray-800 bg-[#111] p-4 transition-colors hover:border-gray-600 hover:bg-[#161616]">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-gray-800 bg-gray-900">
                        <img
                          src={resolveMediaUrl(nft.imageURL)}
                          alt={nft.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-white mb-1 truncate">{nft.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
