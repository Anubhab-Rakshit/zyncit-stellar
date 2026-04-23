const DEFAULT_PLACEHOLDER = "/placeholder.svg"

const isLikelyIpfsHash = (value: string): boolean => {
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(value) || /^bafy[a-z0-9]{20,}$/i.test(value)
}

export const resolveMediaUrl = (value?: string | null, fallback: string = DEFAULT_PLACEHOLDER): string => {
  if (!value) return fallback

  const raw = value.trim()
  if (!raw) return fallback

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
  if (raw.startsWith("//")) return `https:${raw}`

  if (raw.startsWith("ipfs://")) {
    const path = raw.replace("ipfs://", "").replace(/^ipfs\//, "")
    return `https://ipfs.io/ipfs/${path}`
  }

  if (raw.includes("/ipfs/")) {
    const idx = raw.indexOf("/ipfs/")
    const path = raw.slice(idx + "/ipfs/".length)
    return `https://ipfs.io/ipfs/${path}`
  }

  if (isLikelyIpfsHash(raw)) {
    return `https://ipfs.io/ipfs/${raw}`
  }

  return raw.startsWith("/") ? raw : fallback
}
