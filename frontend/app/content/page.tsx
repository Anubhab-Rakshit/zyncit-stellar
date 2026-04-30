"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, FileText, ImageIcon, Clock, TrendingUp, ExternalLink, Share2 } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { useAuth } from "@/lib/auth-context"
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
  updatedAt: string
}

export default function ContentLibraryPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState<"spatial" | "timeline">("spatial")
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const fetchMyNFTs = async () => {
      try {
        setLoading(true)
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

        console.log("[v0] My NFTs response:", data)

        if (data.success) {
          const next = data.data || []
          setNfts(next)
          cacheSet("zync_cache_my_nfts", next, 60_000)
        }
      } catch (error) {
        console.error("[v0] Error fetching NFTs:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchMyNFTs()
    }
  }, [isAuthenticated])

  const filteredNfts = nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 bg-[#0a0a0f]" />
        <FuturisticNavbar />
        <main className="relative min-h-screen pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Loading your creations...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">

      <FuturisticNavbar />

      <main className="relative min-h-screen pt-24 sm:pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[100vw] overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Library
            </h1>
            <p className="text-lg text-gray-400">
              Your digital creations and tokenized assets.
            </p>
            <p className="text-sm font-medium text-gray-500">
              {nfts.length} {nfts.length === 1 ? "creation" : "creations"} minted
            </p>
          </div>

          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <div className="relative flex items-center gap-4 px-6 py-4 rounded-xl border border-gray-800 bg-[#111]">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                />
                <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Filter className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setViewMode("spatial")}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                viewMode === "spatial" ? "bg-white text-black" : "bg-transparent text-gray-400 hover:bg-gray-800"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                viewMode === "timeline" ? "bg-white text-black" : "bg-transparent text-gray-400 hover:bg-gray-800"
              }`}
            >
              Timeline View
            </button>
          </div>

            <div className="text-center py-20 border border-gray-800 bg-[#111] rounded-2xl max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                {searchQuery ? "No results found" : "No creations yet"}
              </h3>
              <p className="text-gray-400 font-medium mb-6">
                {searchQuery ? "Try a different search term." : "Start creating your first NFT."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push("/upload")}
                  className="px-6 py-3 rounded-xl font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Create Your First NFT
                </button>
              )}
            </div>

          {viewMode === "spatial" && filteredNfts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {filteredNfts.map((nft, i) => (
                  <div
                    key={nft._id}
                    className="relative rounded-2xl border border-gray-800 bg-[#111] overflow-hidden transition-colors hover:border-gray-600 hover:bg-[#161616]"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-900 border-b border-gray-800">
                      <img
                        src={resolveMediaUrl(nft.imageURL)}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                        NFT
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                        {nft.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>

                      <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-800">
                        <div>
                          <div className="text-gray-500 font-medium text-xs mb-1">Token ID</div>
                          <div className="font-mono text-gray-300 font-medium">#{nft.tokenId}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500 font-medium text-xs mb-1">IPFS</div>
                          <a
                            href={nft.metadataURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 font-medium hover:text-white transition-colors"
                          >
                            View
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(nft.createdAt).toLocaleDateString()}</span>
                        </div>
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${nft.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="text-xs font-medium">Tx</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {viewMode === "timeline" && filteredNfts.length > 0 && (
            <div className="relative">
              <div
                className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2"
                style={{
                  background: "linear-gradient(90deg, #3b82f6 0%, #b624ff 50%, #dc2626 100%)",
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
                  borderRadius: "50%",
                }}
              />

              <div className="flex items-center gap-16 overflow-x-auto pb-8 scrollbar-hide">
                {filteredNfts.map((nft) => (
                    <div
                      key={nft._id}
                      className="relative flex-shrink-0 w-80 rounded-2xl border border-gray-800 bg-[#111] overflow-hidden transition-colors hover:border-gray-600 hover:bg-[#161616]"
                    >
                      <div className="h-40 overflow-hidden bg-gray-900 border-b border-gray-800">
                        <img
                          src={resolveMediaUrl(nft.imageURL)}
                          alt={nft.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-2 tracking-tight line-clamp-1">{nft.name}</h3>
                        <div className="text-sm text-gray-400 mb-4 line-clamp-2">{nft.description}</div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-sm text-gray-300 font-medium">
                            #{nft.tokenId}
                          </span>
                          <a
                            href={nft.metadataURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            IPFS →
                          </a>
                        </div>
                        <div className="pt-3 border-t border-gray-800 text-xs text-gray-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(nft.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
