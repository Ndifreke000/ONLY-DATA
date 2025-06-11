import { supabase } from "@/lib/supabase/client"

export interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
  }>
}

export class GraphQLClient {
  private endpoint: string
  private headers: Record<string, string>

  constructor() {
    this.endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`
    this.headers = {
      "Content-Type": "application/json",
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  }

  async query<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const headers = { ...this.headers }
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`
      }

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: GraphQLResponse<T> = await response.json()

      if (result.errors && result.errors.length > 0) {
        console.error("GraphQL errors:", result.errors)
        throw new Error(result.errors[0].message)
      }

      return result.data as T
    } catch (error) {
      console.error("GraphQL query error:", error)
      throw error
    }
  }
}

export const graphqlClient = new GraphQLClient()
