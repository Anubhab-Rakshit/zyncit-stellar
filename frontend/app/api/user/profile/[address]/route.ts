export async function GET(request: Request, context: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await context.params

    if (!address) {
      return Response.json({ success: false, message: "Address is required" }, { status: 400 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://movers-honey-bids-shopzilla.trycloudflare.com"
    const response = await fetch(`${backendUrl}/api/wallet/profile/${address}`)
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch user profile" }, { status: 500 })
  }
}
