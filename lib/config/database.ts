import { neon } from "@neondatabase/serverless"

// Use the DATABASE_URL from Neon integration
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
    // Neon handles transactions automatically for multiple queries
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

// Helper function for getting the SQL client directly
export function getDatabase() {
  return sql
}
