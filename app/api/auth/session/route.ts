import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Fetch user data from database
    // This is a placeholder - implement your database logic
    const userData = {
      id: decoded.userId,
      address: decoded.address,
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.avatar,
      provider: decoded.provider,
      socialProvider: decoded.socialProvider,
      isKYCVerified: decoded.isKYCVerified || false,
      isWhitelisted: decoded.isWhitelisted || false,
      smartAccountAddress: decoded.smartAccountAddress,
    }

    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }
}
