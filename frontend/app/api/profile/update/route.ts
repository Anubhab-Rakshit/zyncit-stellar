import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://movers-honey-bids-shopzilla.trycloudflare.com"
    const response = await fetch(`${backendUrl}/api/wallet/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to update profile" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
