import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth/jwt"
import { executeQuery } from "@/lib/config/database"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const location = searchParams.get("location")
    const status = searchParams.get("status") || "active"

    let query = `
      SELECT p.*, u.username as owner_username, u.wallet_address as owner_address
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      query += " AND p.verification_status = ?"
      params.push(status)
    }
    if (category) {
      query += " AND p.property_type = ?"
      params.push(category)
    }
    if (location) {
      query += " AND p.address LIKE ?"
      params.push(`%${location}%`)
    }

    query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, (page - 1) * limit)

    const properties = (await executeQuery(query, params)) as any[]

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM properties p WHERE 1=1"
    const countParams: any[] = []

    if (status) {
      countQuery += " AND p.verification_status = ?"
      countParams.push(status)
    }
    if (category) {
      countQuery += " AND p.property_type = ?"
      countParams.push(category)
    }
    if (location) {
      countQuery += " AND p.address LIKE ?"
      countParams.push(`%${location}%`)
    }

    const [{ total }] = (await executeQuery(countQuery, countParams)) as any[]

    return NextResponse.json({
      properties: properties.map((p) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
        documents: p.documents ? JSON.parse(p.documents) : [],
        verification_documents: p.verification_documents ? JSON.parse(p.verification_documents) : [],
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Properties API error:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

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
    const {
      title,
      description,
      address,
      property_type,
      square_footage,
      bedrooms,
      bathrooms,
      year_built,
      lot_size,
      images,
      documents,
    } = body

    // Validate required fields
    if (!title || !description || !address || !property_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const propertyId = uuidv4()
    const query = `
      INSERT INTO properties (
        id, owner_id, title, description, address, property_type,
        square_footage, bedrooms, bathrooms, year_built, lot_size,
        images, documents, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `

    await executeQuery(query, [
      propertyId,
      user.id,
      title,
      description,
      address,
      property_type,
      square_footage || null,
      bedrooms || null,
      bathrooms || null,
      year_built || null,
      lot_size || null,
      JSON.stringify(images || []),
      JSON.stringify(documents || []),
    ])

    // Fetch the created property
    const [property] = (await executeQuery("SELECT * FROM properties WHERE id = ?", [propertyId])) as any[]

    return NextResponse.json(
      {
        property: {
          ...property,
          images: property.images ? JSON.parse(property.images) : [],
          documents: property.documents ? JSON.parse(property.documents) : [],
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create property error:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
