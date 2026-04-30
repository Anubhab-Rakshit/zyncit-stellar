"use client"

import { useState, useEffect } from "react"
import { Search, ExternalLink, ImageIcon } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  address: string
  name: string
  avatar: string
  bio: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers()
      } else {
        setUsers([])
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  const searchUsers = async () => {
    setLoading(true)
    try {
      console.log("[v0] Searching users with query:", searchQuery)
      const response = await fetch(`/api/user/search?name=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      console.log("[v0] Search response:", data)

      if (data.success) {
        console.log("[v0] Found users:", data.data)
        setUsers(data.data)
      } else {
        console.error("[v0] Search failed:", data.message)
        setUsers([])
      }
    } catch (error) {
      console.error("[v0] Failed to search users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <FuturisticNavbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Discover Creators
            </h1>
            <p className="text-lg text-gray-400">Find and connect with other users.</p>
          </div>

          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="relative flex items-center gap-4 px-6 py-4 rounded-xl border border-gray-800 bg-[#111]">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators by name..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
              <p className="mt-4">Searching...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={user._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => router.push(`/profile/${user.address}`)}
                >
                  <div className="relative rounded-2xl border border-gray-800 bg-[#111] p-6 transition-colors hover:border-gray-600 hover:bg-[#161616]">
                    <div className="flex items-center gap-6">
                      {/* Avatar */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-800 bg-gray-900 flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold tracking-tight text-white mb-1 truncate">{user.name || "Unnamed User"}</h3>
                        <p className="text-sm text-gray-500 font-mono mb-2">
                          {user.address.slice(0, 8)}...{user.address.slice(-6)}
                        </p>
                        {user.bio && <p className="text-sm text-gray-400 line-clamp-1">{user.bio}</p>}
                      </div>

                      {/* View button */}
                      <div className="flex-shrink-0">
                        <button className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center text-gray-400 py-12">
              <p>No creators found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>Start typing to search for creators</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
