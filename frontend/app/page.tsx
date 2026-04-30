"use client"

import { useEffect, useState } from "react"
import { Users, Coins, ArrowRight, Rocket, Star, Lock } from "lucide-react"
import LoadingAnimation from "@/components/loading-animation"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { resolveMediaUrl } from "@/lib/media"

interface NFT {
  _id: string
  name: string
  description: string
  imageURL: string
  owner: string
  artistName?: string
  tokenId: string
}

const useScrollReveal = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())

  useEffect(() => {
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
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return visibleElements
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [featuredNFTs, setFeaturedNFTs] = useState<NFT[]>([])
  const visibleElements = useScrollReveal()

  useEffect(() => {
    const fetchFeaturedNFTs = async () => {
      try {
        const response = await fetch("/api/nfts/all")
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          const nftsWithArtists = await Promise.all(
            data.data.slice(0, 8).map(async (nft: NFT) => {
              try {
                const profileResponse = await fetch(`/api/user/profile/${nft.owner}`)
                const profileData = await profileResponse.json()
                return {
                  ...nft,
                  artistName:
                    profileData.success && profileData.user?.name
                      ? profileData.user.name
                      : `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`,
                }
              } catch (error) {
                return {
                  ...nft,
                  artistName: `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`,
                }
              }
            }),
          )
          setFeaturedNFTs(nftsWithArtists)
        }
      } catch (error) {
        console.error("Failed to fetch NFTs:", error)
      }
    }

    fetchFeaturedNFTs()
  }, [])

  return (
    <div className="bg-[#0a0a0a]">
      {isLoading && <LoadingAnimation onComplete={() => setIsLoading(false)} />}

      <FuturisticNavbar />

      <main className="relative min-h-screen max-w-[100vw] overflow-x-hidden">
        {/* Hero Section - Clean and Professional */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          {/* Main content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 w-full">
            {/* Professional Logo - ZYNC */}
            <div
              className="flex justify-center mb-8 animate-fadeInScale"
              style={{ animationDelay: "0.2s" }}
            >
              <img
                src="/logo.png"
                alt="ZYNC"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
              />
            </div>

            {/* Main title */}
            <div
              className="space-y-6 animate-fadeInScale"
              style={{ animationDelay: "0.4s" }}
            >
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white"
              >
                Decentralized Publishing, <br className="hidden md:block" />
                <span className="text-gray-500">Refined.</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                Tokenize your creativity, connect with the creator economy, and build sustainable digital ownership on the blockchain.
              </p>
            </div>

            {/* CTA Button */}
            <div
              className="flex justify-center pt-8 animate-fadeInScale"
              style={{ animationDelay: "0.6s" }}
            >
              <a href="/gallery" className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors duration-200">
                Explore Gallery
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>

            {/* Key Statistics */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 px-4 max-w-4xl mx-auto animate-fadeInScale stagger-children"
              style={{ animationDelay: "0.8s" }}
            >
              {[
                { icon: Users, label: "Active Creators", value: "127K+", color: "#3b82f6" },
                { icon: Coins, label: "Assets Tokenized", value: "1.2M", color: "#0284c7" },
                { icon: Rocket, label: "Value Distributed", value: "$45M+", color: "#06b6d4" },
              ].map((stat, i) => (
                <div
                  key={i}
                  data-scroll-reveal
                  id={`stat-${i}`}
                  className={`p-6 sm:p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:border-gray-700 cursor-pointer group ${
                    visibleElements.has(`stat-${i}`)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="space-y-4">
                    <stat.icon
                      className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors"
                    />
                    <div
                      className="text-3xl sm:text-4xl font-bold text-white tracking-tight animate-number-counter"
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-sm font-medium text-gray-500 group-hover:text-gray-400 transition-colors"
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2
                data-scroll-reveal
                id="features-title"
                className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 transition-all duration-500 ${
                  visibleElements.has("features-title")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Built for the modern web.
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Everything you need to publish, monetize, and grow on the blockchain. Without the complexity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
              {[
                {
                  icon: Lock,
                  title: "Decentralized Control",
                  description: "Full ownership and control over your content with blockchain-backed security",
                  color: "#3b82f6",
                  delay: "0s",
                },
                {
                  icon: Coins,
                  title: "Tokenize Assets",
                  description: "Transform any content into tradable tokens and generate passive income",
                  color: "#0284c7",
                  delay: "0.1s",
                },
                {
                  icon: Star,
                  title: "Creator Economy",
                  description: "Connect directly with your audience and build sustainable communities",
                  color: "#06b6d4",
                  delay: "0.2s",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  data-scroll-reveal
                  id={`feature-${i}`}
                  className={`group rounded-2xl p-8 border border-gray-800 bg-[#111] transition-all duration-500 hover:border-gray-600 ${
                    visibleElements.has(`feature-${i}`)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-6">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content Section */}
        {featuredNFTs.length > 0 && (
          <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  data-scroll-reveal
                  id="featured-title"
                  className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white transition-all duration-500 ${
                    visibleElements.has("featured-title")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  Featured Content
                </h2>
                <p className="text-gray-400 mt-4 text-lg">Discover the latest creations from our community.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                {featuredNFTs.map((nft, i) => (
                  <a
                    key={nft._id}
                    href={`/post/${nft._id}`}
                    data-scroll-reveal
                    id={`nft-${i}`}
                    className={`group rounded-2xl border border-gray-800 bg-[#111] overflow-hidden transition-all duration-300 hover:border-gray-600 cursor-pointer ${
                      visibleElements.has(`nft-${i}`)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-900">
                      <img
                        src={resolveMediaUrl(nft.imageURL)}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-medium text-white line-clamp-1 group-hover:text-gray-300 transition-colors">
                        {nft.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{nft.artistName}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2
              data-scroll-reveal
              id="cta-title"
              className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white transition-all duration-500 ${
                visibleElements.has("cta-title")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Start building today.
            </h2>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Join thousands of creators revolutionizing digital ownership. The new standard for content is here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <a href="/upload" className="flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Get Started
              </a>
              <a href="/gallery" className="flex items-center justify-center px-8 py-4 bg-[#111] text-white font-semibold rounded-full border border-gray-700 hover:bg-gray-900 transition-colors">
                Explore Platform
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
