"use client"

import { useEffect, useState } from "react"
import { Zap, Users, Coins, Globe, ArrowRight, Network, Hexagon } from "lucide-react"
import LoadingAnimation from "@/components/loading-animation"
import FuturisticNavbar from "@/components/futuristic-navbar"
import AnimatedBackground from "@/components/animated-background"

interface NFT {
  _id: string
  name: string
  description: string
  imageURL: string
  owner: string
  artistName?: string
  tokenId: string
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [featuredNFTs, setFeaturedNFTs] = useState<NFT[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    setIsVisible(true)

    const fetchFeaturedNFTs = async () => {
      try {
        const response = await fetch("/api/nfts/all")
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          // Get first 8 NFTs with artist names
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

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {isLoading && <LoadingAnimation onComplete={() => setIsLoading(false)} />}

      <AnimatedBackground />

      <FuturisticNavbar />

      <main className="relative min-h-screen max-w-[100vw] overflow-x-hidden">
        {/* Immersive Intro Zone */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          {/* Floating accent blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-transparent blur-3xl animate-float"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 rounded-full bg-gradient-to-br from-[#dc2626]/20 to-transparent blur-3xl animate-float"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute top-1/2 right-1/3 w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 rounded-full bg-gradient-to-br from-[#0284c7]/20 to-transparent blur-3xl animate-float"
              style={{ animationDelay: "4s" }}
            />
          </div>

          {/* Central content */}
          <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8 sm:space-y-12 w-full">
            {/* Logo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 animate-spin-slow">
                  <div
                    className="w-full h-full rounded-full border-4 border-transparent border-t-[#3b82f6] border-r-[#dc2626] border-b-[#0284c7]"
                    style={{
                      filter: "drop-shadow(0 0 20px #3b82f6) drop-shadow(0 0 40px #dc2626)",
                    }}
                  />
                </div>
                <div
                  className="absolute inset-6 animate-spin-slow"
                  style={{ animationDirection: "reverse", animationDuration: "15s" }}
                >
                  <div
                    className="w-full h-full rounded-full border-3 border-transparent border-l-[#0284c7] border-b-[#3b82f6] opacity-70"
                    style={{
                      filter: "drop-shadow(0 0 15px #0284c7)",
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Hexagon
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-[#3b82f6] animate-glow-pulse"
                    style={{
                      filter: "drop-shadow(0 0 30px #3b82f6)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Main title */}
            <div
              className={`space-y-4 sm:space-y-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h1
                className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-wider px-4"
                style={{
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #3b82f6 0%, #0284c7 40%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 0.5))",
                }}
              >
                ZYNC
              </h1>
              <p
                className="font-[family-name:var(--font-display)] text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#3b82f6] tracking-widest px-4"
                style={{
                  letterSpacing: "0.15em",
                  textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                }}
              >
                DECENTRALIZED PUBLISHING
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                Experience the future of content creation on the blockchain. Tokenize your creativity, connect with the
                metaverse economy, and revolutionize digital ownership.
              </p>
            </div>

            {/* CTA Button */}
            <div
              className={`flex justify-center transition-all duration-1000 delay-300 px-4 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <button className="group relative px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 font-[family-name:var(--font-display)] text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-wider overflow-hidden transition-all duration-500 hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] via-[#0284c7] to-[#dc2626] animate-gradient-shift opacity-100"
                  style={{
                    filter: "blur(2px)",
                  }}
                />
                <div className="absolute inset-[2px] bg-[#0a0a0f] group-hover:bg-[#0f1419] transition-colors duration-300" />

                <span className="relative flex items-center gap-2 sm:gap-3 text-white group-hover:text-[#3b82f6] transition-colors duration-300 whitespace-nowrap">
                  ENTER THE METAVERSE
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300" />
                </span>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-gradient-to-r from-[#3b82f6] via-[#0284c7] to-[#dc2626]"
                  style={{
                    transform: "scale(1.5)",
                  }}
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
                </div>
              </button>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20 px-4 max-w-5xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {[
                { icon: Users, label: "TOTAL CREATORS", value: "127,459", color: "#3b82f6", delay: 0 },
                { icon: Coins, label: "ASSETS TOKENIZED", value: "1.2M", color: "#dc2626", delay: 200 },
                { icon: Globe, label: "REVENUE DISTRIBUTED", value: "$45.8M", color: "#0284c7", delay: 400 },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative glass rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2"
                  style={{
                    animationDelay: `${stat.delay}ms`,
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4)`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{ background: `${stat.color}20` }}
                  />

                  <div className="relative space-y-3 sm:space-y-4">
                    <stat.icon
                      className="w-10 h-10 sm:w-12 sm:h-12 mx-auto transition-all duration-300 group-hover:scale-110"
                      style={{ color: stat.color }}
                    />
                    <div
                      className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-black gradient-text"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-widest text-gray-400"
                      style={{ letterSpacing: "0.12em" }}
                    >
                      {stat.label}
                    </div>
                  </div>

                  <div
                    className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-all duration-300 group-hover:w-6 group-hover:h-6 sm:group-hover:w-8 sm:group-hover:h-8"
                    style={{ borderColor: stat.color }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-all duration-300 group-hover:w-6 group-hover:h-6 sm:group-hover:w-8 sm:group-hover:h-8"
                    style={{ borderColor: stat.color }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CREATOR ECONOMY */}
        <section className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2
                className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-wider mb-4 sm:mb-6"
                style={{
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #3b82f6 0%, #0284c7 50%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))",
                }}
              >
                CREATOR ECONOMY
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                Visualize the interconnected network of creators, assets, and value flowing through the ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Users,
                  title: "CREATORS",
                  count: "127K+",
                  description: "Independent creators earning through decentralized publishing",
                  color: "#3b82f6",
                  gradient: "from-[#3b82f6]/20 to-[#0284c7]/20",
                },
                {
                  icon: Coins,
                  title: "ASSETS",
                  count: "1.2M",
                  description: "Tokenized content pieces generating passive income",
                  color: "#dc2626",
                  gradient: "from-[#dc2626]/20 to-[#ef4444]/20",
                },
                {
                  icon: Network,
                  title: "CONNECTIONS",
                  count: "5.8M",
                  description: "Active P2P transactions flowing through the network",
                  color: "#0284c7",
                  gradient: "from-[#0284c7]/20 to-[#06b6d4]/20",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative"
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className={`relative h-[350px] sm:h-[400px] rounded-2xl sm:rounded-3xl bg-gradient-to-br ${item.gradient} backdrop-blur-xl border border-white/10 transition-all duration-500 hover:-translate-y-4`}
                    style={{
                      transform: "translateZ(0)",
                      boxShadow: `
                        0 30px 80px -20px rgba(0, 0, 0, 0.8),
                        0 20px 50px -30px ${item.color}40,
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.5)
                      `,
                    }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8 space-y-4 sm:space-y-6">
                      <div className="relative">
                        <div
                          className="absolute inset-0 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: item.color }}
                        />
                        <item.icon
                          className="relative w-16 h-16 sm:w-20 sm:h-20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                          style={{
                            color: item.color,
                            filter: `drop-shadow(0 0 30px ${item.color})`,
                          }}
                        />
                      </div>

                      <div
                        className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-black tracking-wider"
                        style={{
                          background: `linear-gradient(135deg, ${item.color} 0%, #ffffff 100%)`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          filter: `drop-shadow(0 0 20px ${item.color}60)`,
                        }}
                      >
                        {item.count}
                      </div>

                      <div
                        className="font-[family-name:var(--font-display)] text-lg sm:text-xl md:text-2xl font-bold tracking-widest"
                        style={{
                          color: item.color,
                          letterSpacing: "0.12em",
                          textShadow: `0 0 20px ${item.color}40`,
                        }}
                      >
                        {item.title}
                      </div>

                      <p className="text-center text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xs">
                        {item.description}
                      </p>

                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full animate-gradient-shift"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, ${item.color} 50%, transparent 100%)`,
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className="absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 opacity-50 group-hover:opacity-100 group-hover:w-12 group-hover:h-12 sm:group-hover:w-16 sm:group-hover:h-16 transition-all duration-500"
                      style={{ borderColor: item.color }}
                    />
                    <div
                      className="absolute bottom-4 right-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 opacity-50 group-hover:opacity-100 group-hover:w-12 group-hover:h-12 sm:group-hover:w-16 sm:group-hover:h-16 transition-all duration-500"
                      style={{ borderColor: item.color }}
                    />

                    <div
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${item.color}20 0%, transparent 70%)`,
                      }}
                    />
                  </div>

                  <div
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl -z-10 blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                    style={{
                      background: item.color,
                      transform: "translateZ(-50px) scale(0.95)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tokenization Showcase */}
        <section className="relative py-20 md:py-32 px-4 bg-[#141419]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-black tracking-wider mb-8"
                style={{
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #3b82f6 0%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {"TURN ANYTHING INTO ASSETS"}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {"Articles, Music, Art, Videos — All Tokenized"}
              </p>
            </div>

            {/* Horizontal scrolling container with snap */}
            <div className="relative">
              {/* Fade gradients on edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#141419] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#141419] to-transparent z-10 pointer-events-none" />

              <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4">
                {(featuredNFTs.length > 0
                  ? featuredNFTs
                  : [
                      {
                        _id: "demo1",
                        name: "The Future of Web3",
                        artistName: "Alex Morgan",
                        price: "0.5 XLM",
                        tokenId: "#7821",
                        imageURL: "/futuristic-article-web3.jpg",
                        owner: "0xabc...", // Dummy owner
                        description: "A deep dive into the evolving landscape of decentralized web technologies.",
                      },
                      {
                        _id: "demo2",
                        name: "Digital Symphony #42",
                        artistName: "Aria Soundwave",
                        price: "1.2 XLM",
                        tokenId: "#4392",
                        imageURL: "/placeholder.svg?key=music42",
                        owner: "0xdef...", // Dummy owner
                        description: "An ambient electronic track exploring sonic textures.",
                      },
                      {
                        _id: "demo3",
                        name: "Neon Dreams",
                        artistName: "Pixel Master",
                        price: "2.8 XLM",
                        tokenId: "#1156",
                        imageURL: "/placeholder.svg?key=art1156",
                        owner: "0xghi...", // Dummy owner
                        description: "A vibrant digital painting capturing the essence of a futuristic cityscape.",
                      },
                      {
                        _id: "demo4",
                        name: "Metaverse Journey",
                        artistName: "Chris Director",
                        price: "1.5 XLM",
                        tokenId: "#9483",
                        imageURL: "/placeholder.svg?key=video9483",
                        owner: "0xjkl...", // Dummy owner
                        description: "A short film documenting an exploration of virtual worlds.",
                      },
                      {
                        _id: "demo5",
                        name: "DeFi Revolution 2025",
                        artistName: "Sarah Crypto",
                        price: "0.8 XLM",
                        tokenId: "#6274",
                        imageURL: "/placeholder.svg?key=article6274",
                        owner: "0xmnp...", // Dummy owner
                        description: "An analysis of the projected growth and impact of decentralized finance.",
                      },
                      {
                        _id: "demo6",
                        name: "Blockchain Beats Vol.3",
                        artistName: "DJ Decentralized",
                        price: "1.0 XLM",
                        tokenId: "#3891",
                        imageURL: "/placeholder.svg?key=music3891",
                        owner: "0xstu...", // Dummy owner
                        description: "A collection of cutting-edge tracks built on blockchain rhythms.",
                      },
                      {
                        _id: "demo7",
                        name: "Abstract Protocol",
                        artistName: "Neo Artist",
                        price: "3.5 XLM",
                        tokenId: "#2047",
                        imageURL: "/placeholder.svg?key=art2047",
                        owner: "0vwx...", // Dummy owner
                        description: "An experimental artwork exploring the visual representation of code.",
                      },
                      {
                        _id: "demo8",
                        name: "Smart Contract Tutorial",
                        artistName: "Dev Academy",
                        price: "0.3 XLM",
                        tokenId: "#8219",
                        imageURL: "/placeholder.svg?key=video8219",
                        owner: "0xyz...", // Dummy owner
                        description: "A comprehensive guide to understanding and writing smart contracts.",
                      },
                    ]
                ).map((item, i) => {
                  const color = ["#3b82f6", "#dc2626", "#0284c7"][i % 3]
                  const isReal = featuredNFTs.length > 0
                  return (
                    <div
                      key={item._id}
                      className="group flex-shrink-0 w-80 snap-center"
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        className="relative h-96 rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-4 cursor-pointer"
                        onClick={() => isReal && (window.location.href = `/post/${item._id}`)}
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                          boxShadow: `
                            0 30px 60px -15px rgba(0, 0, 0, 0.8),
                            0 0 40px ${color}20,
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                          `,
                        }}
                      >
                        {/* Content preview area with real image */}
                        <div className="relative h-48 overflow-hidden">
                          {isReal ? (
                            <img
                              src={item.imageURL || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <div
                                className="absolute inset-0 animate-gradient-shift"
                                style={{
                                  background: `linear-gradient(135deg, ${color}80 0%, ${color}40 50%, ${color}20 100%)`,
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-6xl font-[family-name:var(--font-display)] font-black text-white/10 rotate-12">
                                  NFT
                                </div>
                              </div>
                            </>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                        </div>

                        {/* Metadata section */}
                        <div className="p-6 space-y-4">
                          {/* Type badge */}
                          <div className="flex items-center justify-between">
                            <div
                              className="px-4 py-1 rounded-full text-xs font-[family-name:var(--font-display)] font-bold tracking-wider"
                              style={{
                                background: `${color}20`,
                                color: color,
                                border: `1px solid ${color}40`,
                              }}
                            >
                              {isReal ? "NFT" : "DEMO"}
                            </div>
                            <div className="text-xs font-mono text-gray-500">#{item.tokenId}</div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-[#3b82f6] transition-colors line-clamp-2">
                            {item.name}
                          </h3>

                          {/* Creator info */}
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                              style={{
                                borderColor: color,
                                color: color,
                                background: `${color}10`,
                              }}
                            >
                              {item.artistName?.[0] || "?"}
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Creator</div>
                              <div className="text-sm font-semibold text-white">{item.artistName}</div>
                            </div>
                          </div>

                          {/* View Details button */}
                          <button
                            className="w-full py-3 rounded-lg font-[family-name:var(--font-display)] text-sm font-bold tracking-wider transition-all duration-300 hover:scale-105"
                            style={{
                              background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
                              border: `1px solid ${color}60`,
                              color: color,
                              boxShadow: `0 0 20px ${color}00`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = `0 0 30px ${color}50`
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = `0 0 20px ${color}00`
                            }}
                          >
                            VIEW DETAILS
                          </button>
                        </div>

                        {/* 3D corner accents */}
                        <div
                          className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 opacity-50 group-hover:opacity-100 group-hover:w-12 group-hover:h-12 transition-all duration-300"
                          style={{ borderColor: color }}
                        />
                        <div
                          className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 opacity-50 group-hover:opacity-100 group-hover:w-12 group-hover:h-12 transition-all duration-300"
                          style={{ borderColor: color }}
                        />

                        {/* Glow on hover */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
                          style={{ boxShadow: `0 0 60px ${color}60` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Decentralized Dashboard Preview */}
        <section className="relative py-20 md:py-32 px-4 bg-gradient-to-br from-[#0a0a0f] via-[#1e3a5f]/20 to-[#0a0a0f]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#dc2626] to-transparent opacity-50" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-black tracking-wider mb-4"
                style={{
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #3b82f6 0%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {"YOUR COMMAND CENTER"}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {"Manage, monitor, and monetize — all in one place"}
              </p>
            </div>

            {/* Dashboard mockup with 3D tilt */}
            <div
              className="relative mx-auto max-w-6xl"
              style={{
                perspective: "2000px",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="relative rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.02]"
                style={{
                  transform: "rotateX(8deg) rotateY(-4deg)",
                  boxShadow: `
                    0 50px 100px -20px rgba(0, 0, 0, 0.9),
                    0 30px 90px rgba(59, 130, 246, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  background: "linear-gradient(135deg, #0f0f14 0%, #12121a 100%)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                {/* Dashboard top bar */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#dc2626]" />
                    <span className="font-[family-name:var(--font-display)] text-xl font-bold text-white tracking-wider">
                      {"ZYNCIT DASHBOARD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#3b82f6] text-sm font-mono">
                      {"GC6P...7H2W"}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#0284c7]" />
                  </div>
                </div>

                {/* Dashboard content grid */}
                <div className="grid md:grid-cols-3 gap-6 p-6">
                  {/* Revenue Chart */}
                  <div className="md:col-span-2 glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">{"Revenue Overview"}</h3>
                      <div className="text-sm text-gray-400">{"Last 30 days"}</div>
                    </div>
                    {/* Simple CSS bar chart */}
                    <div className="flex items-end justify-between gap-2 h-48">
                      {[40, 70, 45, 85, 60, 95, 75, 50, 90, 65, 100, 80].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full rounded-t-lg transition-all duration-500 hover:scale-105"
                            style={{
                              height: `${height}%`,
                              background: `linear-gradient(180deg, #3b82f6 0%, #dc2626 100%)`,
                              boxShadow: `0 0 20px ${i % 2 === 0 ? "#3b82f6" : "#dc2626"}40`,
                              animation: `slideUp 0.${i + 5}s ease-out`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="space-y-4">
                    {[
                      { label: "Today's Earnings", value: "4.2 XLM", color: "#3b82f6", change: "+12%" },
                      { label: "Total Views", value: "128K", color: "#0284c7", change: "+8%" },
                      { label: "Active Tokens", value: "47", color: "#dc2626", change: "+3" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="glass rounded-xl p-4 hover:scale-105 transition-all duration-300"
                        style={{
                          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5)`,
                        }}
                      >
                        <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                        <div className="flex items-end justify-between">
                          <div className="text-2xl font-bold" style={{ color: stat.color }}>
                            {stat.value}
                          </div>
                          <div className="text-xs font-mono px-2 py-1 rounded bg-white/5" style={{ color: stat.color }}>
                            {stat.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Content */}
                  <div className="md:col-span-2 glass rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">{"Recent Content"}</h3>
                    <div className="space-y-3">
                      {[
                        { title: "The Future of Web3", type: "Article", views: "12.3K" },
                        { title: "Digital Symphony #42", type: "Music", views: "8.7K" },
                        { title: "Neon Dreams", type: "Art", views: "15.9K" },
                      ].map((content, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3b82f6]/40 to-[#dc2626]/40" />
                            <div>
                              <div className="text-sm font-semibold text-white">{content.title}</div>
                              <div className="text-xs text-gray-500">{content.type}</div>
                            </div>
                          </div>
                          <div className="text-sm text-[#3b82f6]">{content.views}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">{"Activity"}</h3>
                    <div className="space-y-3">
                      {[
                        { action: "NFT Minted", time: "2m ago", color: "#3b82f6" },
                        { action: "Payment Received", time: "15m ago", color: "#0284c7" },
                        { action: "New Follower", time: "1h ago", color: "#dc2626" },
                        { action: "Content Viewed", time: "2h ago", color: "#3b82f6" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: activity.color }} />
                          <div className="flex-1">
                            <div className="text-sm text-white">{activity.action}</div>
                            <div className="text-xs text-gray-500">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating feature cards */}
              {[
                { label: "Real-time Updates", icon: Zap, position: "top-4 -left-20", color: "#3b82f6" },
                { label: "Instant Payments", icon: Coins, position: "top-1/3 -right-24", color: "#dc2626" },
                { label: "Advanced Analytics", icon: Network, position: "bottom-1/4 -left-24", color: "#0284c7" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="hidden lg:block absolute"
                  style={{
                    top: feature.position.includes("top") ? feature.position.split(" ")[0].split("-")[1] : "auto",
                    left: feature.position.includes("left")
                      ? feature.position.split(" ")[1].substring(1) + "px"
                      : "auto",
                    right: feature.position.includes("right")
                      ? feature.position.split(" ")[1].substring(1) + "px"
                      : "auto",
                    bottom: feature.position.includes("bottom") ? feature.position.split(" ")[0].split("-")[1] : "auto",
                    animationDelay: `${i * 0.3}s`,
                    boxShadow: `0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px ${feature.color}30`,
                  }}
                  className={`glass rounded-2xl p-4 animate-float ${
                    feature.position.startsWith("top")
                      ? "top-4"
                      : feature.position.startsWith("bottom")
                        ? "bottom-4"
                        : ""
                  } ${feature.position.includes("left") ? "-left-20" : feature.position.includes("right") ? "-right-24" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                    <span className="text-sm font-semibold text-white whitespace-nowrap">{feature.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Decentralization Visualization section */}
        <section className="relative py-20 md:py-32 px-4 bg-[#0a0a0f]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0284c7] to-transparent opacity-50" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2
                className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-black tracking-wider mb-6"
                style={{
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #3b82f6 0%, #0284c7 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {"TRULY DECENTRALIZED. TRULY YOURS."}
              </h2>
            </div>

            {/* Comparison grid */}
            <div className="grid md:grid-cols-2 gap-12">
              {/* Centralized (Old Way) */}
              <div
                className="glass rounded-3xl p-8 border-[#dc2626]/30"
                style={{ boxShadow: "0 20px 60px rgba(220, 38, 38, 0.2)" }}
              >
                <div className="text-center mb-8">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#dc2626] tracking-wider mb-2">
                    {"CENTRALIZED (OLD WAY)"}
                  </h3>
                  <p className="text-sm text-gray-500">{"Single point of failure"}</p>
                </div>

                {/* Centralized network diagram */}
                <div className="relative h-80 mb-8">
                  {/* Central platform node */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                        boxShadow: "0 0 60px rgba(220, 38, 38, 0.6), inset 0 2px 10px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <span className="text-2xl">{"⚠️"}</span>
                    </div>
                  </div>

                  {/* Creator nodes connected only to center */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                    const radius = 120
                    const x = Math.cos((angle * Math.PI) / 180) * radius
                    const y = Math.sin((angle * Math.PI) / 180) * radius + 60

                    return (
                      <div key={i}>
                        {/* Connection line */}
                        <svg className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-40">
                          <line
                            x1="50%"
                            y1="50%"
                            x2={`calc(50% + ${x}px)`}
                            y2={`calc(50% + ${y}px)`}
                            stroke="#dc2626"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                        </svg>

                        {/* Creator node */}
                        <div
                          className="absolute top-1/4 left-1/2"
                          style={{
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          }}
                        >
                          <div
                            className="w-12 h-12 rounded-full bg-[#7f1d1d] border-2 border-[#dc2626]/50"
                            style={{ boxShadow: "0 5px 20px rgba(220, 38, 38, 0.4)" }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Negatives list */}
                <div className="space-y-3">
                  {[
                    "❌ Platform controls everything",
                    "❌ High fees (30-50%)",
                    "❌ Can be shut down",
                    "❌ Your content, their rules",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-400">
                      <span className="text-lg">{item.split(" ")[0]}</span>
                      <span className="text-sm">{item.split(" ").slice(1).join(" ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decentralized (Our Way) */}
              <div
                className="glass rounded-3xl p-8 border-[#3b82f6]/30"
                style={{ boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3)" }}
              >
                <div className="text-center mb-8">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#3b82f6] tracking-wider mb-2">
                    {"DECENTRALIZED (OUR WAY)"}
                  </h3>
                  <p className="text-sm text-gray-400">{"Creator-owned network"}</p>
                </div>

                {/* Decentralized mesh network */}
                <div className="relative h-80 mb-8">
                  {[
                    { x: 0, y: -80 },
                    { x: 80, y: -40 },
                    { x: 80, y: 40 },
                    { x: 0, y: 80 },
                    { x: -80, y: 40 },
                    { x: -80, y: -40 },
                  ].map((pos, i) => {
                    const nextPos = [
                      { x: 0, y: -80 },
                      { x: 80, y: -40 },
                      { x: 80, y: 40 },
                      { x: 0, y: 80 },
                      { x: -80, y: 40 },
                      { x: -80, y: -40 },
                      { x: 0, y: -80 },
                    ][i + 1]

                    return (
                      <div key={i}>
                        {/* Mesh connections */}
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                          <defs>
                            <linearGradient id={`mesh-grad-${i}`}>
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4">
                                <animate attributeName="offset" values="0%;1%;0%" dur="2s" repeatCount="indefinite" />
                              </stop>
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                            </linearGradient>
                          </defs>
                          <line
                            x1={`calc(50% + ${pos.x}px)`}
                            y1={`calc(50% + ${pos.y}px)`}
                            x2={`calc(50% + ${nextPos.x}px)`}
                            y2={`calc(50% + ${nextPos.y}px)`}
                            stroke={`url(#mesh-grad-${i})`}
                            strokeWidth="2"
                          />
                        </svg>

                        {/* Node */}
                        <div
                          className="absolute top-1/2 left-1/2"
                          style={{
                            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                          }}
                        >
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
                            style={{
                              background: "linear-gradient(135deg, #3b82f6 0%, #0284c7 100%)",
                              boxShadow:
                                "0 10px 40px rgba(59, 130, 246, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
                              animationDelay: `${i * 0.2}s`,
                            }}
                          >
                            <span className="text-xl">{"✓"}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Positives list */}
                <div className="space-y-3">
                  {[
                    "✅ You keep 95% of earnings",
                    "✅ Full ownership & control",
                    "✅ Censorship-resistant",
                    "✅ Your rules, your platform",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <span className="text-lg">{item.split(" ")[0]}</span>
                      <span className="text-sm font-semibold">{item.split(" ").slice(1).join(" ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials/Creator Stories section */}
        <section className="relative py-20 md:py-32 px-4 bg-gradient-to-b from-[#141419] to-[#0a0a0f]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-black tracking-wider mb-4"
                style={{
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #3b82f6 0%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {"CREATORS ARE THRIVING"}
              </h2>
              <p className="text-xl text-gray-400">{"Real stories from our community"}</p>
            </div>

            {/* Testimonial cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  quote:
                    "ZYNC transformed how I monetize my content. I went from earning $500/month to $8,000 in just 3 months. The decentralized model means I keep what I earn.",
                  name: "Alex Morgan",
                  role: "Digital Artist",
                  earnings: "$47,200",
                  gradient: "from-[#3b82f6]/30 to-[#0284c7]/30",
                },
                {
                  quote:
                    "Finally, a platform that puts creators first. The NFT minting is seamless, and I love having full ownership of my work. Best decision I've made for my music career.",
                  name: "Aria Soundwave",
                  role: "Music Producer",
                  earnings: "$63,890",
                  gradient: "from-[#dc2626]/30 to-[#ef4444]/30",
                },
                {
                  quote:
                    "The community here is incredible. Being able to tokenize my articles and earn royalties forever changed my writing business. This is the future of content creation.",
                  name: "Jordan Rivers",
                  role: "Tech Writer",
                  earnings: "$31,540",
                  gradient: "from-[#0284c7]/30 to-[#06b6d4]/30",
                },
              ].map((testimonial, i) => (
                <div key={i} className="group relative" style={{ perspective: "1000px" }}>
                  <div
                    className={`relative h-full rounded-3xl bg-gradient-to-br ${testimonial.gradient} backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:-translate-y-4`}
                    style={{
                      boxShadow: `
                        0 30px 60px -15px rgba(0, 0, 0, 0.7),
                        0 20px 40px rgba(59, 130, 246, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                    }}
                  >
                    {/* Decorative quote marks */}
                    <div className="absolute top-4 left-4 text-6xl text-[#3b82f6]/10 font-serif leading-none">
                      {'"'}
                    </div>

                    {/* Star rating */}
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-lg text-gray-300 leading-relaxed mb-8 relative z-10">{testimonial.quote}</p>

                    {/* Creator profile */}
                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                        style={{
                          background: "linear-gradient(135deg, #3b82f6 0%, #dc2626 100%)",
                          boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
                        }}
                      >
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>

                    {/* Earnings badge */}
                    <div
                      className="absolute bottom-8 right-8 px-4 py-2 rounded-full text-sm font-bold"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6 0%, #0284c7 100%)",
                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                      }}
                    >
                      {"Earned "}
                      {testimonial.earnings}
                    </div>

                    {/* Glow on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-2xl"
                      style={{ background: "linear-gradient(135deg, #3b82f6 0%, #dc2626 100%)" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 glass rounded-3xl p-12">
              {[
                { value: "50K+", label: "CREATORS" },
                { value: "2M+", label: "ASSETS" },
                { value: "$10M+", label: "EARNED" },
                { value: "150+", label: "COUNTRIES" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div
                    className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-black mb-2"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #dc2626 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-[family-name:var(--font-display)] text-sm tracking-widest text-gray-400"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Non-Linear Footer */}
        <footer className="relative py-12 sm:py-16 md:py-20 px-4 mt-16 sm:mt-20 md:mt-32 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-16 sm:h-20 md:h-24 -translate-y-1/2"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60 C200 20, 400 100, 600 60 C800 20, 1000 100, 1200 60 L1200 120 L0 120 Z"
              fill="url(#footerGradient)"
            />
            <defs>
              <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#12121a" stopOpacity="1" />
                <stop offset="50%" stopColor="#0a0a0f" stopOpacity="1" />
                <stop offset="100%" stopColor="#12121a" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 bg-gradient-to-br from-[#12121a] via-[#0a0a0f] to-[#12121a]" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              <div className="space-y-4 sm:space-y-6">
                <div
                  className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black tracking-wider gradient-text"
                  style={{ letterSpacing: "0.1em" }}
                >
                  ZYNC
                </div>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Building the future of decentralized content creation, one block at a time.
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className="font-[family-name:var(--font-display)] text-sm tracking-wider text-[#3b82f6] mb-6"
                  style={{ letterSpacing: "0.15em" }}
                >
                  NAVIGATE
                </div>
                {["Platform", "Tokenization", "Dashboard", "Documentation", "Community"].map((link, i) => (
                  <div key={i}>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div
                  className="font-[family-name:var(--font-display)] text-sm tracking-wider text-[#dc2626] mb-6"
                  style={{ letterSpacing: "0.15em" }}
                >
                  JOIN THE REVOLUTION
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm sm:text-base text-white placeholder-gray-600 focus:border-[#3b82f6] focus:outline-none transition-all duration-300"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#dc2626] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>

                <div className="flex gap-3 sm:gap-4 pt-4">
                  {["X", "Discord", "Telegram"].map((social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#3b82f6] hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 group"
                    >
                      <span className="text-xs font-[family-name:var(--font-display)] font-bold group-hover:scale-110 transition-transform">
                        {social.slice(0, 1)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-500 font-mono text-center sm:text-left">
                © 2025 ZYNC. Powered by Web3 technology.
              </div>
              <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
                <a href="#" className="hover:text-[#3b82f6] transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-[#3b82f6] transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-[#3b82f6] transition-colors">
                  Security
                </a>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-gradient-to-br from-[#3b82f6]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-gradient-to-tr from-[#dc2626]/10 to-transparent rounded-full blur-3xl" />
        </footer>
      </main>
    </>
  )
}
