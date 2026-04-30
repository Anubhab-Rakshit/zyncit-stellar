"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, Check, FileText, X } from "lucide-react"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { resolveMediaUrl } from "@/lib/media"

export default function UploadMintPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadedNFT, setUploadedNFT] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !name || !description) {
      setError("Please fill all fields")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const token = localStorage.getItem("zync_token")
      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.")
      }

      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("name", name)
      formData.append("description", description)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || data.action || "Upload failed")
      }

      setUploadedNFT(data.nft)
      setUploadSuccess(true)
    } catch (err: any) {
      console.error("[v0] Upload error:", err)
      setError(err.message || "Failed to upload content")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setName("")
    setDescription("")
    setUploadSuccess(false)
    setUploadedNFT(null)
    setError(null)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">

      <FuturisticNavbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[100vw] overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {uploadSuccess ? "Minted successfully." : "Create & Mint"}
            </h1>
            <p className="text-gray-400 text-lg">
              {uploadSuccess ? "Your content has been tokenized." : "Tokenize your content on the blockchain."}
            </p>
          </div>

          {!uploadSuccess ? (
            <div className="rounded-2xl border border-gray-800 bg-[#111] p-8 md:p-12">
              {/* File Upload Zone */}
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Upload File</label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer overflow-hidden ${
                      isDragging
                        ? "border-gray-500 bg-gray-800"
                        : "border-gray-700 hover:border-gray-600 hover:bg-[#161616]"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInput")?.click()}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      accept="image/*,video/*,audio/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(file)
                      }}
                    />

                    <div className="relative text-center z-10">
                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-4">
                          <FileText className="w-12 h-12 text-blue-400" />
                          <div className="text-left">
                            <div className="text-white font-semibold text-lg">{selectedFile.name}</div>
                            <div className="text-sm text-gray-400">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(null)
                            }}
                            className="p-2 rounded-full hover:bg-red-500/20 transition-colors"
                          >
                            <X className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-800">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg text-white mb-2 font-medium">Drag & drop your file here</p>
                          <p className="text-sm text-gray-500">or click to select from your device</p>
                          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                            <span className="px-3 py-1 rounded bg-gray-900 border border-gray-800">Images</span>
                            <span className="px-3 py-1 rounded bg-gray-900 border border-gray-800">Videos</span>
                            <span className="px-3 py-1 rounded bg-gray-900 border border-gray-800">Audio</span>
                            <span className="px-3 py-1 rounded bg-gray-900 border border-gray-800">Documents</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">NFT Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a captivating name..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 outline-none transition-colors focus:border-gray-500"
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Description</label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your content's story and vision..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 outline-none transition-colors focus:border-gray-500 resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-600 font-medium">
                      {description.length} characters
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile || !name || !description}
                  className="w-full py-4 rounded-xl bg-white text-black font-semibold text-base transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                        Minting NFT...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Mint NFT
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            // Success State
            <div className="rounded-2xl border border-gray-800 bg-[#111] p-12 text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-10 w-10 text-green-500" />
              </div>

              <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">Minted Successfully!</h2>
              <p className="mb-8 text-gray-400">Your content has been tokenized on the blockchain.</p>

              {uploadedNFT && (
                <div className="mx-auto max-w-md mb-8">
                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-left space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-500">Name</span>
                      <span className="font-semibold text-white">{uploadedNFT.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-500">Token ID</span>
                      <span className="font-mono text-gray-300">#{uploadedNFT.tokenId}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-500">Transaction</span>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${uploadedNFT.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-gray-300 hover:text-white transition-colors"
                      >
                        {uploadedNFT.txHash.slice(0, 10)}...{uploadedNFT.txHash.slice(-8)}
                      </a>
                    </div>
                    {uploadedNFT.imageURL && (
                      <div className="pt-4 border-t border-gray-800">
                        <img
                          src={resolveMediaUrl(uploadedNFT.imageURL)}
                          alt={uploadedNFT.name}
                          className="w-full h-48 object-cover rounded-lg border border-gray-800"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/content")}
                  className="px-8 py-3 rounded-xl font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  View in Library
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 rounded-xl font-semibold border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
