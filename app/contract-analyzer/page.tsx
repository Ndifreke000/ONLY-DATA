"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, FileText, Zap, Download, Eye, Code, CheckCircle, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function ContractAnalyzerPage() {
  const [contractAddress, setContractAddress] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analyzedData, setAnalyzedData] = useState<any>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }
      setUploadedFile(file)
      toast.success("Smart contract file uploaded successfully")
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }
      setUploadedFile(file)
      toast.success("Smart contract file uploaded successfully")
    }
  }, [])

  const analyzeContract = async () => {
    if (!contractAddress && !uploadedFile) {
      toast.error("Please provide a contract address or upload a file")
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalyzedData({
            contractName: "StarkDeFi Liquidity Pool",
            contractType: "AMM Pool",
            totalValueLocked: "2,450,000 USDC",
            totalTransactions: 15420,
            uniqueUsers: 3241,
            gasEfficiency: 94,
            securityScore: 87,
            zkProofCount: 8934,
            functions: [
              { name: "add_liquidity", calls: 8934, gasUsed: "2.4M", zkOptimized: true },
              { name: "remove_liquidity", calls: 6486, gasUsed: "1.8M", zkOptimized: true },
              { name: "swap", calls: 12456, gasUsed: "3.2M", zkOptimized: false },
            ],
            events: [
              { name: "LiquidityAdded", count: 8934 },
              { name: "LiquidityRemoved", count: 6486 },
              { name: "Swap", count: 12456 },
            ],
            zkInsights: {
              proofGeneration: "Optimized",
              verificationTime: "0.3s avg",
              privacyLevel: "High",
              scalabilityScore: 92,
            },
          })
          toast.success("Smart contract analysis completed!")
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  return (
    <div className="h-full w-full p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Smart Contract Analyzer
            </h1>
            <p className="text-muted-foreground mt-2">
              Upload and analyze Starknet smart contracts with advanced ZK insights and data extraction
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">ZK-Powered</Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Starknet Native</Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="h-fit border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-500" />
                Analyze Smart Contract
              </CardTitle>
              <CardDescription>
                Upload a contract file (.cairo, .json) or provide a Starknet contract address for comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="address" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="address">Contract Address</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="address" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractAddress">Starknet Contract Address</Label>
                    <Input
                      id="contractAddress"
                      placeholder="0x..."
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a valid Starknet contract address to fetch and analyze on-chain data
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Smart Contract File</Label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-orange-200 dark:border-orange-800 rounded-lg p-8 text-center hover:border-orange-400 dark:hover:border-orange-600 transition-colors cursor-pointer bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20"
                    >
                      <Upload className="h-10 w-10 mx-auto mb-4 text-orange-500" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your smart contract file here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Supports .cairo, .json, .sol files (max 10MB)
                      </p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".cairo,.json,.sol,.txt"
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        asChild
                        variant="outline"
                        className="border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/20"
                      >
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                    </div>
                    {uploadedFile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
                      >
                        <FileText className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </span>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {isAnalyzing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500 animate-pulse" />
                    <span className="text-sm font-medium">Analyzing smart contract...</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Extracting contract structure, analyzing ZK proofs, and generating insights
                  </p>
                </motion.div>
              )}

              <Button
                onClick={analyzeContract}
                disabled={isAnalyzing || (!contractAddress && !uploadedFile)}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Analyze Contract
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Features */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Analysis Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>ZK-proof verification and optimization analysis</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Gas efficiency and cost optimization insights</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Security vulnerability detection</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Transaction pattern and usage analytics</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Starknet-specific optimizations</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {analyzedData ? (
            <Card className="h-full border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-orange-500" />
                    Analysis Results
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Contract Name</p>
                    <p className="font-semibold">{analyzedData.contractName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Contract Type</p>
                    <Badge variant="outline" className="border-orange-200 text-orange-600">
                      {analyzedData.contractType}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Value Locked</p>
                    <p className="font-semibold text-green-600">{analyzedData.totalValueLocked}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">ZK Proofs Generated</p>
                    <p className="font-semibold text-purple-600">{analyzedData.zkProofCount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Gas Efficiency</p>
                    <div className="flex items-center gap-2">
                      <Progress value={analyzedData.gasEfficiency} className="flex-1" />
                      <span className="text-sm font-medium">{analyzedData.gasEfficiency}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Security Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={analyzedData.securityScore} className="flex-1" />
                      <span className="text-sm font-medium">{analyzedData.securityScore}%</span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="functions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="functions">Functions</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="zk-insights">ZK Insights</TabsTrigger>
                  </TabsList>

                  <TabsContent value="functions" className="space-y-3 mt-4">
                    {analyzedData.functions.map((func: any, i: number) => (
                      <motion.div
                        key={func.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{func.name}()</p>
                            <p className="text-xs text-muted-foreground">{func.calls} calls</p>
                          </div>
                          {func.zkOptimized && (
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                              ZK Optimized
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline">{func.gasUsed}</Badge>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="events" className="space-y-3 mt-4">
                    {analyzedData.events.map((event: any, i: number) => (
                      <motion.div
                        key={event.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
                      >
                        <p className="font-medium">{event.name}</p>
                        <Badge variant="outline">{event.count.toLocaleString()}</Badge>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="zk-insights" className="space-y-3 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-muted-foreground">Proof Generation</p>
                        <p className="font-semibold text-purple-600">{analyzedData.zkInsights.proofGeneration}</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-muted-foreground">Verification Time</p>
                        <p className="font-semibold text-purple-600">{analyzedData.zkInsights.verificationTime}</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-muted-foreground">Privacy Level</p>
                        <p className="font-semibold text-purple-600">{analyzedData.zkInsights.privacyLevel}</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-muted-foreground">Scalability Score</p>
                        <p className="font-semibold text-purple-600">{analyzedData.zkInsights.scalabilityScore}%</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center border-orange-200 dark:border-orange-800">
              <CardContent className="text-center py-12">
                <Star className="h-16 w-16 mx-auto mb-4 text-orange-500/50" />
                <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Upload a smart contract file or provide a contract address to get started with comprehensive analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
