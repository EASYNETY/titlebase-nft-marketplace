import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyJWT(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { tokenId, price, duration, listingType } = body

    // Validate listing data
    if (!tokenId || !price || !listingType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create marketplace listing (mock implementation)
    const listing = {
      id: Date.now().toString(),
      tokenId,
      price,
      duration,
      listingType,
      seller: user.address,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt: duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString() : null,
    }

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error("Create listing error:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}
