export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return Response.json({ success: false, message: "No authorization token" }, { status: 401 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://movers-honey-bids-shopzilla.trycloudflare.com"
    const response = await fetch(`${backendUrl}/api/upload/my-nfts`, {
      headers: {
        Authorization: authHeader,
      },
    })

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch NFTs" }, { status: 500 })
  }
}
