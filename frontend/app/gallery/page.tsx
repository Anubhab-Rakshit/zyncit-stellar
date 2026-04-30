"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, Heart, Share2 } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
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
  artistName?: string
}

export default function GalleryPage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        console.log("[v0] Fetching NFTs from /api/nfts/all")
        const response = await fetch("/api/nfts/all")
        const data = await response.json()
        console.log("[v0] NFTs response:", data)

        if (data.success) {
          const nftsWithArtists = await Promise.all(
            data.data.map(async (nft: NFT) => {
              try {
                console.log(`[v0] Fetching profile for owner: ${nft.owner}`)
                const profileResponse = await fetch(`/api/user/profile/${nft.owner}`)
                const profileData = await profileResponse.json()
                console.log(`[v0] Profile data for ${nft.owner}:`, profileData)

                // Check if we got a valid user with a name
                const artistName =
                  profileData.success && profileData.user?.name
                    ? profileData.user.name
                    : `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`

                console.log(`[v0] Artist name for ${nft.owner}: ${artistName}`)

                return {
                  ...nft,
                  artistName,
                }
              } catch (error) {
                console.error(`[v0] Error fetching profile for ${nft.owner}:`, error)
                return {
                  ...nft,
                  artistName: `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`,
                }
              }
            }),
          )
          console.log("[v0] NFTs with artist names:", nftsWithArtists)
          setNfts(nftsWithArtists)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch NFTs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [])


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

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <FuturisticNavbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Gallery
            </h1>
            <p className="text-gray-400 text-lg">Discover and collect digital works.</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20">
              <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
              <p className="mt-4">Loading NFTs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {nfts.map((nft, index) => (
                <div
                  key={nft._id}
                  className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glass card */}
                  <div
                    className="relative rounded-2xl border border-gray-800 bg-[#111] p-4 transition-colors duration-300 hover:border-gray-600 hover:bg-[#161616] cursor-pointer"
                    onClick={() => setSelectedNFT(nft)}
                  >
                    {/* Inner content */}
                    <div className="relative">
                      {/* Image */}
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-900 border border-gray-800">
                        <img
                          src={resolveMediaUrl(nft.imageURL)}
                          alt={nft.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2 mb-4">
                        <h3 className="text-xl font-bold text-white tracking-tight truncate">{nft.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Artist</span>
                            <span className="text-sm text-gray-300 font-medium">{nft.artistName}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Token</span>
                            <span className="text-sm text-gray-300 font-mono">#{nft.tokenId}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA buttons */}
                      <div className="flex gap-2">
                        <button
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white font-medium text-sm hover:bg-gray-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/post/${nft._id}`)
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View
                        </button>
                        <button
                          className="p-2 rounded-lg border border-gray-800 bg-[#111] text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg border border-gray-800 bg-[#111] text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            sharePost(nft)
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedNFT && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedNFT(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-2xl border border-gray-800 bg-[#111] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNFT(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-gray-800 bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                <img
                  src={resolveMediaUrl(selectedNFT.imageURL)}
                  alt={selectedNFT.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{selectedNFT.name}</h2>
                  <p className="text-gray-400 leading-relaxed">{selectedNFT.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Artist</p>
                    <p className="text-white font-semibold">{selectedNFT.artistName}</p>
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Token ID</p>
                    <p className="text-gray-300 font-mono text-sm">#{selectedNFT.tokenId}</p>
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Transaction</p>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${selectedNFT.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 font-mono text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      {selectedNFT.txHash.slice(0, 10)}...{selectedNFT.txHash.slice(-8)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  View on Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
