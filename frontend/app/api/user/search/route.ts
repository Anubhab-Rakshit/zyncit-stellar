export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name") || ""

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://movers-honey-bids-shopzilla.trycloudflare.com"
    const response = await fetch(`${backendUrl}/api/wallet/search?name=${encodeURIComponent(name)}`)
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json({ success: false, message: "Failed to search users" }, { status: 500 })
  }
}
