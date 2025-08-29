import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 })
    }

    // Create or find user in database
    // This is a placeholder - implement your database logic
    const userData = {
      id: `wallet_${address}`,
      address,
      provider: "wallet",
      isKYCVerified: false,
      isWhitelisted: false, // Check against marketplace guard
    }

    // Create JWT token
    const token = jwt.sign(userData, process.env.JWT_SECRET!, { expiresIn: "7d" })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Wallet auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
