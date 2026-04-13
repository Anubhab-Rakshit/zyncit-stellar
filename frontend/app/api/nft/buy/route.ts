export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5001"
    const response = await fetch(`${backendUrl}/api/nft/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (_error) {
    return Response.json({ success: false, message: "Failed to buy NFT" }, { status: 500 })
  }
}
