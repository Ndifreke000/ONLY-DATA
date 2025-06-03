"use client"

import { useState } from "react"
import { Save, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PythonSandboxPage() {
  const [notebooks] = useState([
    { id: 1, name: "Starknet Analysis.ipynb", lastModified: "2 hours ago" },
    { id: 2, name: "TVL Trends.ipynb", lastModified: "1 day ago" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Python Sandbox</h1>
          <p className="text-slate-400 mt-2">Analyze data with Jupyter notebooks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-slate-800 border-slate-700">
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
          <Button className="bg-[#5C6AC4] hover:bg-[#5C6AC4]/90">
            <Plus className="h-4 w-4 mr-2" />
            New Notebook
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Your Notebooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notebooks.map((notebook) => (
                <div
                  key={notebook.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <FileText className="h-5 w-5 text-[#22D3EE]" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">{notebook.name}</div>
                    <div className="text-xs text-slate-400">{notebook.lastModified}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-slate-800 border-slate-700 h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Starknet Analysis.ipynb</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-700">
                    Python 3.11
                  </Badge>
                  <Badge className="bg-green-600">Connected</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              <div className="h-full bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <div className="space-y-4">
                  {/* Cell 1 */}
                  <div className="border-l-4 border-[#5C6AC4] pl-4">
                    <div className="text-slate-400 text-xs mb-2">In [1]:</div>
                    <div className="bg-slate-800 p-3 rounded">
                      <code className="text-slate-200">
                        {`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from starknet_data import get_transactions

# Load Starknet transaction data
df = get_transactions(days=30)
print(f"Loaded {len(df)} transactions")`}
                      </code>
                    </div>
                    <div className="text-slate-400 text-xs mt-2 mb-1">Out [1]:</div>
                    <div className="bg-slate-950 p-2 rounded text-slate-300">Loaded 1,234,567 transactions</div>
                  </div>

                  {/* Cell 2 */}
                  <div className="border-l-4 border-[#22D3EE] pl-4">
                    <div className="text-slate-400 text-xs mb-2">In [2]:</div>
                    <div className="bg-slate-800 p-3 rounded">
                      <code className="text-slate-200">
                        {`# Daily active users analysis
daily_users = df.groupby(df['timestamp'].dt.date)['from_address'].nunique()
daily_users.plot(kind='line', figsize=(12, 6))
plt.title('Daily Active Users on Starknet')
plt.show()`}
                      </code>
                    </div>
                    <div className="text-slate-400 text-xs mt-2 mb-1">Out [2]:</div>
                    <div className="bg-slate-950 p-4 rounded">
                      <div className="h-32 bg-gradient-to-r from-[#5C6AC4]/20 to-[#22D3EE]/20 rounded flex items-center justify-center text-slate-400">
                        [Chart: Daily Active Users Trend]
                      </div>
                    </div>
                  </div>

                  {/* New Cell */}
                  <div className="border-l-4 border-slate-600 pl-4">
                    <div className="text-slate-400 text-xs mb-2">In [ ]:</div>
                    <div className="bg-slate-800 p-3 rounded">
                      <textarea
                        className="w-full bg-transparent text-slate-200 resize-none focus:outline-none"
                        placeholder="Enter your Python code here..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
