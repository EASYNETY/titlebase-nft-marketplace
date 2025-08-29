import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const results = await sql(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function executeTransaction(queries: Array<{ query: string; params: any[] }>) {
  try {
    // Note: Neon serverless doesn't support traditional transactions
    // For production, consider using Neon's transaction API or handle atomicity at application level
    const results = []
    for (const { query, params } of queries) {
      const result = await sql(query, params)
      results.push(result)
    }
    return results
  } catch (error) {
    console.error("Transaction error:", error)
    throw error
  }
}

// Helper function for the Neon SQL client
export { sql }
