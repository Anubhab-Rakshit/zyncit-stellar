export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://movers-honey-bids-shopzilla.trycloudflare.com"
    const response = await fetch(`${backendUrl}/api/upload/find`, { cache: 'no-store' })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend returned ${response.status}: ${errorText}`);
      return Response.json({ success: false, message: `Backend error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error: any) {
    console.error("Fetch error in /api/nfts/all:", error);
    return Response.json({ success: false, message: "Failed to fetch NFTs", error: error.message }, { status: 500 })
  }
}
