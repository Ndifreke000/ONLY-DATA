"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, Zap, Download, Eye, Code, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function ContractExtractorPage() {
  const [contractAddress, setContractAddress] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<any>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size must be less than 10MB")
        return
      }
      setUploadedFile(file)
      toast.success("Contract file uploaded successfully")
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
      toast.success("Contract file uploaded successfully")
    }
  }, [])

  const extractContract = async () => {
    if (!contractAddress && !uploadedFile) {
      toast.error("Please provide a contract address or upload a file")
      return
    }

    setIsExtracting(true)
    setExtractionProgress(0)

    // Simulate extraction progress
    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExtracting(false)
          setExtractedData({
            contractName: "StarkDeFi Protocol",
            totalValueLocked: "2,450,000 USDC",
            totalTransactions: 15420,
            uniqueUsers: 3241,
            functions: [
              { name: "deposit", calls: 8934, gasUsed: "2.4M" },
              { name: "withdraw", calls: 6486, gasUsed: "1.8M" },
              { name: "swap", calls: 12456, gasUsed: "3.2M" },
            ],
            events: [
              { name: "Deposit", count: 8934 },
              { name: "Withdrawal", count: 6486 },
              { name: "Swap", count: 12456 },
            ],
          })
          toast.success("Contract data extracted successfully!")
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
            <h1 className="text-3xl font-bold tracking-tight">Contract Data Extractor</h1>
            <p className="text-muted-foreground mt-2">
              Extract and analyze data from Starknet smart contracts with AI-powered insights
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] text-white">AI-Powered</Badge>
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
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#5C6AC4]" />
                Extract Contract Data
              </CardTitle>
              <CardDescription>
                Provide a contract address or upload a contract file to extract comprehensive data
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
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Contract File</Label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-[#5C6AC4]/50 transition-colors cursor-pointer"
                    >
                      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your contract file here, or click to browse
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
                      <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                    </div>
                    {uploadedFile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                      >
                        <FileText className="h-4 w-4 text-[#5C6AC4]" />
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </span>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {isExtracting && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#5C6AC4] animate-pulse" />
                    <span className="text-sm font-medium">Extracting contract data...</span>
                  </div>
                  <Progress value={extractionProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">Analyzing contract structure and transaction history</p>
                </motion.div>
              )}

              <Button
                onClick={extractContract}
                disabled={isExtracting || (!contractAddress && !uploadedFile)}
                className="w-full bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] hover:from-[#5C6AC4]/90 hover:to-[#22D3EE]/90"
              >
                {isExtracting ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Extract Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Extraction Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Supports all Starknet contract addresses</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Automatically detects contract type and standards</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Extracts transaction history and event logs</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Generates insights on usage patterns</span>
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
          {extractedData ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-[#22D3EE]" />
                    Extracted Data
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Contract Name</p>
                    <p className="font-semibold">{extractedData.contractName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Value Locked</p>
                    <p className="font-semibold text-[#5C6AC4]">{extractedData.totalValueLocked}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="font-semibold">{extractedData.totalTransactions.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Unique Users</p>
                    <p className="font-semibold">{extractedData.uniqueUsers.toLocaleString()}</p>
                  </div>
                </div>

                <Tabs defaultValue="functions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="functions">Functions</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                  </TabsList>

                  <TabsContent value="functions" className="space-y-3 mt-4">
                    {extractedData.functions.map((func: any, i: number) => (
                      <motion.div
                        key={func.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{func.name}()</p>
                          <p className="text-xs text-muted-foreground">{func.calls} calls</p>
                        </div>
                        <Badge variant="outline">{func.gasUsed}</Badge>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="events" className="space-y-3 mt-4">
                    {extractedData.events.map((event: any, i: number) => (
                      <motion.div
                        key={event.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <p className="font-medium">{event.name}</p>
                        <Badge variant="outline">{event.count.toLocaleString()}</Badge>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Data Extracted Yet</h3>
                <p className="text-muted-foreground">
                  Provide a contract address or upload a file to get started with data extraction.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
