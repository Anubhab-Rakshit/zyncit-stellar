export async function GET(
  _request: Request,
  context: { params: Promise<{ txHash: string }> },
) {
  try {
    const { txHash } = await context.params
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5001"
    const response = await fetch(`${backendUrl}/api/tx/status/${txHash}`, {
      cache: "no-store",
    })
    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (error) {
    return Response.json(
      { success: false, errorCode: "UNKNOWN", message: "Failed to fetch tx status" },
      { status: 500 },
    )
  }
}
