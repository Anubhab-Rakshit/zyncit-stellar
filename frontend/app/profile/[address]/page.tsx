import type { Metadata } from "next"
import ProfileDetail from "./profile-detail"

interface PageProps {
  params: Promise<{ address: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { address } = await params
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const response = await fetch(`${baseUrl}/api/wallet/profile/${address}`)
    const data = await response.json()

    if (!data.success || !data.user) {
      return {
        title: "Profile Not Found | ZYNC",
        description: "The requested profile could not be found.",
      }
    }

    return {
      title: `${data.user.name || "Creator"} | ZYNC`,
      description: data.user.bio || `View ${data.user.name}'s creations on ZYNC`,
      openGraph: {
        title: data.user.name || "Creator Profile",
        description: data.user.bio || "View this creator's NFT collection on ZYNC",
        images: data.user.avatar ? [data.user.avatar] : [],
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: data.user.name || "Creator Profile",
        description: data.user.bio,
        images: data.user.avatar ? [data.user.avatar] : [],
      },
    }
  } catch (error) {
    return {
      title: "ZYNC",
      description: "Decentralized content creation platform",
    }
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { address } = await params
  return <ProfileDetail address={address} />
}
