"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { ExternalLink, Trash2, Upload, Share2 } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { cacheGet, cacheSet } from "@/lib/cache"
import { resolveMediaUrl } from "@/lib/media"

interface NFT {
  _id: string
  owner: string
  name: string
  description: string
  imageURL: string
  metadataURL: string
  ipfsHash: string
  tokenId: string
  txHash: string
  createdAt: string
}

export default function MyNFTsPage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    const fetchMyNFTs = async () => {
      try {
        const cached = cacheGet<NFT[]>("zync_cache_my_nfts")
        if (cached) {
          setNfts(cached)
          setLoading(false)
        }

        const token = localStorage.getItem("zync_token")
        if (!token) {
          router.push("/auth")
          return
        }

        const response = await fetch("/api/nfts/my-nfts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (data.success) {
          setNfts(data.data)
          cacheSet("zync_cache_my_nfts", data.data, 60_000)
        }
      } catch (error) {
        console.error("Failed to fetch NFTs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyNFTs()
  }, [isAuthenticated, router])

  const sharePost = async (nft: NFT) => {
    const url = `${window.location.origin}/post/${nft._id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: nft.name,
          text: nft.description,
          url: url,
        })
      } catch (error) {
        navigator.clipboard.writeText(url)
      }
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <FuturisticNavbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              My Creations
            </h1>
            <p className="text-gray-400 text-lg">Your tokenized masterpieces.</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20">
              <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
              <p className="mt-4">Loading your NFTs...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-20">
              <div className="rounded-2xl border border-gray-800 bg-[#111] p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-4">No NFTs Yet</h3>
                <p className="text-gray-400 mb-8 font-medium">Start creating your digital legacy</p>
                <a
                  href="/upload"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Upload Your First NFT
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {nfts.map((nft, index) => (
                <div
                  key={nft._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative rounded-2xl border border-gray-800 bg-[#111] p-6 transition-colors duration-300 hover:border-gray-600 hover:bg-[#161616]">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-900 border border-gray-800">
                      <img
                        src={resolveMediaUrl(nft.imageURL)}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-white mb-2 truncate">{nft.name}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{nft.description}</p>

                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-800">
                      <span className="text-xs font-medium text-gray-300 font-mono">Token #{nft.tokenId}</span>
                      <span className="text-xs font-medium text-gray-500">{new Date(nft.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/post/${nft._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white font-medium text-sm hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => sharePost(nft)}
                        className="p-2 rounded-lg border border-gray-800 bg-[#111] text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg border border-gray-800 bg-[#111] text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
