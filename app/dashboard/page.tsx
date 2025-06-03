import { BarChart3, Database, FileCode, Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome to your DATA analytics workspace.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Recent Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <Database className="h-3 w-3 mr-1" />
              <span>Last 7 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Notebooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <FileCode className="h-3 w-3 mr-1" />
              <span>Python notebooks</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Hackathons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <Trophy className="h-3 w-3 mr-1" />
              <span>Open competitions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              <span>Query views</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription className="text-slate-400">Your recently created or viewed queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Database className="h-5 w-5 text-[#5C6AC4]" />
                  <div>
                    <div className="font-medium">Starknet TVL Analysis {i}</div>
                    <div className="text-xs text-slate-400">Updated 2 days ago</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Recent Notebooks</CardTitle>
            <CardDescription className="text-slate-400">Your Python notebooks and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <FileCode className="h-5 w-5 text-[#22D3EE]" />
                  <div>
                    <div className="font-medium">Starknet Transaction Analysis {i}</div>
                    <div className="text-xs text-slate-400">Updated 5 days ago</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
