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
    const status = searchParams.get("status") || "verified"

    let query = `
      SELECT p.*, u.name as owner_username, u.email as owner_email
      FROM properties p
      LEFT JOIN users_sync u ON p.owner_id = u.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      query += ` AND p.verification_status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }
    if (category) {
      query += ` AND p.property_type = $${paramIndex}`
      params.push(category)
      paramIndex++
    }
    if (location) {
      query += ` AND p.address ILIKE $${paramIndex}`
      params.push(`%${location}%`)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, (page - 1) * limit)

    const properties = await executeQuery(query, params)

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM properties p WHERE 1=1"
    const countParams: any[] = []
    let countParamIndex = 1

    if (status) {
      countQuery += ` AND p.verification_status = $${countParamIndex}`
      countParams.push(status)
      countParamIndex++
    }
    if (category) {
      countQuery += ` AND p.property_type = $${countParamIndex}`
      countParams.push(category)
      countParamIndex++
    }
    if (location) {
      countQuery += ` AND p.address ILIKE $${countParamIndex}`
      countParams.push(`%${location}%`)
      countParamIndex++
    }

    const countResult = await executeQuery(countQuery, countParams)
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      properties: properties.map((p: any) => ({
        ...p,
        images: p.images || [],
        documents: p.documents || [],
      })),
      pagination: {
        page,
        limit,
        total: Number(total),
        pages: Math.ceil(Number(total) / limit),
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
      city,
      state,
      zip_code,
      property_type,
      square_feet,
      bedrooms,
      bathrooms,
      year_built,
      lot_size,
      estimated_value,
      images,
      documents,
    } = body

    // Validate required fields
    if (!title || !description || !address || !city || !state || !zip_code || !property_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const propertyId = uuidv4()
    const query = `
      INSERT INTO properties (
        id, owner_id, title, description, address, city, state, zip_code, property_type,
        square_feet, bedrooms, bathrooms, year_built, lot_size, estimated_value,
        images, documents, verification_status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
      RETURNING *
    `

    const result = await executeQuery(query, [
      propertyId,
      user.id,
      title,
      description,
      address,
      city,
      state,
      zip_code,
      property_type,
      square_feet || null,
      bedrooms || null,
      bathrooms || null,
      year_built || null,
      lot_size || null,
      estimated_value || null,
      JSON.stringify(images || []),
      JSON.stringify(documents || []),
      "pending",
    ])

    const property = result[0]

    return NextResponse.json(
      {
        property: {
          ...property,
          images: property.images || [],
          documents: property.documents || [],
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create property error:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
