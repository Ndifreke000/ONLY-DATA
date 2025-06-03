"use client"

import { useState } from "react"
import { Play, Save, Share, Download, Database, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const sampleQuery = `-- Starknet Daily Active Users
SELECT 
  DATE(block_timestamp) as date,
  COUNT(DISTINCT from_address) as active_users,
  COUNT(*) as total_transactions
FROM starknet.transactions 
WHERE block_timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(block_timestamp)
ORDER BY date DESC;`

const mockResults = [
  { date: "2024-01-15", active_users: 12543, total_transactions: 45678 },
  { date: "2024-01-14", active_users: 11234, total_transactions: 42341 },
  { date: "2024-01-13", active_users: 13456, total_transactions: 48923 },
]

const schemas = [
  {
    name: "starknet",
    tables: [
      { name: "transactions", columns: ["hash", "from_address", "to_address", "block_timestamp", "value"] },
      { name: "blocks", columns: ["number", "hash", "timestamp", "transaction_count"] },
      { name: "contracts", columns: ["address", "name", "type", "created_at"] },
    ],
  },
]

export default function SQLSandboxPage() {
  const [query, setQuery] = useState(sampleQuery)
  const [isRunning, setIsRunning] = useState(false)

  const runQuery = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 2000)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Schema Browser */}
      <div className="w-80 flex flex-col">
        <Card className="bg-slate-800 border-slate-700 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Schema Browser
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {schemas.map((schema) => (
                <div key={schema.name} className="px-4 pb-4">
                  <div className="font-medium text-slate-200 mb-2">{schema.name}</div>
                  <div className="space-y-1">
                    {schema.tables.map((table) => (
                      <div key={table.name} className="ml-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100 cursor-pointer py-1">
                          <Table className="h-3 w-3" />
                          {table.name}
                        </div>
                        <div className="ml-6 space-y-0.5">
                          {table.columns.map((column) => (
                            <div key={column} className="text-xs text-slate-400 hover:text-slate-300 cursor-pointer">
                              {column}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">SQL Sandbox</h1>
            <Badge variant="secondary" className="bg-slate-700">
              Connected to Starknet
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={runQuery} disabled={isRunning} className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run Query"}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Query Editor */}
          <Card className="bg-slate-800 border-slate-700 flex-1">
            <CardContent className="p-0 h-full">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-full p-4 bg-transparent text-slate-200 font-mono text-sm resize-none focus:outline-none"
                placeholder="Enter your SQL query here..."
              />
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-slate-800 border-slate-700 flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Query Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2 text-slate-300">Date</th>
                          <th className="text-left p-2 text-slate-300">Active Users</th>
                          <th className="text-left p-2 text-slate-300">Total Transactions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.map((row, i) => (
                          <tr key={i} className="border-b border-slate-700/50">
                            <td className="p-2 text-slate-200">{row.date}</td>
                            <td className="p-2 text-slate-200">{row.active_users.toLocaleString()}</td>
                            <td className="p-2 text-slate-200">{row.total_transactions.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="chart" className="mt-4">
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    Chart visualization would appear here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
