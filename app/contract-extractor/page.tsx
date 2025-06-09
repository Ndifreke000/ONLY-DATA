"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { toast } from "sonner"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FileText,
  Shield,
  Zap,
  Code,
  Database,
  Download,
  Trash2,
  Search,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react"

// Mock contract analysis data
const mockAnalysisResults = {
  contractInfo: {
    name: "StarkSwap Router",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    type: "DEX Router",
    compiler: "Cairo 1.0",
    verified: true,
    deployedAt: "2024-01-15T10:30:00Z",
    deployer: "0x123...abc",
    balance: "1,234.56 ETH",
    transactionCount: 15234,
  },
  securityAnalysis: {
    score: 85,
    issues: [
      { severity: "High", count: 0 },
      { severity: "Medium", count: 2 },
      { severity: "Low", count: 5 },
      { severity: "Info", count: 8 },
    ],
    vulnerabilities: [
      {
        id: 1,
        severity: "Medium",
        title: "Unchecked External Call",
        description: "External call without proper error handling",
        line: 142,
        recommendation: "Add proper error handling for external calls",
      },
      {
        id: 2,
        severity: "Medium",
        title: "Missing Access Control",
        description: "Function lacks proper access control",
        line: 89,
        recommendation: "Implement role-based access control",
      },
      {
        id: 3,
        severity: "Low",
        title: "Gas Optimization",
        description: "Loop can be optimized for gas efficiency",
        line: 203,
        recommendation: "Consider using more efficient loop patterns",
      },
    ],
  },
  codeAnalysis: {
    linesOfCode: 1247,
    functions: 23,
    complexity: "Medium",
    dependencies: 8,
    testCoverage: 78,
    documentation: 65,
  },
  performanceMetrics: {
    gasUsage: {
      average: 45000,
      maximum: 120000,
      minimum: 21000,
    },
    transactionVolume: {
      daily: 2340000,
      weekly: 16380000,
      monthly: 70200000,
    },
    activeUsers: {
      daily: 1234,
      weekly: 8567,
      monthly: 23456,
    },
  },
  dataExtraction: {
    events: [
      { name: "Swap", count: 12456, lastSeen: "2 mins ago" },
      { name: "AddLiquidity", count: 3456, lastSeen: "5 mins ago" },
      { name: "RemoveLiquidity", count: 1234, lastSeen: "8 mins ago" },
      { name: "Transfer", count: 23456, lastSeen: "1 min ago" },
    ],
    functions: [
      { name: "swapExactTokensForTokens", calls: 8765, gasAvg: 45000 },
      { name: "addLiquidity", calls: 2345, gasAvg: 67000 },
      { name: "removeLiquidity", calls: 1234, gasAvg: 52000 },
      { name: "getAmountsOut", calls: 15678, gasAvg: 23000 },
    ],
    storage: [
      { key: "totalSupply", value: "1000000000000000000000000", type: "uint256" },
      { key: "balanceOf", value: "mapping", type: "mapping(address => uint256)" },
      { key: "allowance", value: "mapping", type: "mapping(address => mapping(address => uint256))" },
    ],
  },
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content?: string
  uploadedAt: Date
  status: "uploading" | "analyzing" | "completed" | "error"
  progress: number
  analysisResults?: typeof mockAnalysisResults
}

export default function ContractExtractor() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [contractAddress, setContractAddress] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisOptions, setAnalysisOptions] = useState({
    security: true,
    performance: true,
    codeQuality: true,
    dataExtraction: true,
    gasOptimization: true,
    documentation: false,
  })
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">("json")
  const [isExporting, setIsExporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { state: sidebarState } = useSidebar()
  const [contentPadding, setContentPadding] = useState("pl-0")

  // Update padding based on sidebar state
  useEffect(() => {
    if (sidebarState === "collapsed") {
      setContentPadding("pl-4")
    } else {
      setContentPadding("pl-0")
    }
  }, [sidebarState])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          content: reader.result as string,
          uploadedAt: new Date(),
          status: "uploading",
          progress: 0,
        }

        setUploadedFiles((prev) => [...prev, newFile])

        // Simulate upload progress
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setUploadedFiles((prev) =>
              prev.map((f) => (f.id === newFile.id ? { ...f, status: "completed", progress: 100 } : f)),
            )
          } else {
            setUploadedFiles((prev) => prev.map((f) => (f.id === newFile.id ? { ...f, progress } : f)))
          }
        }, 200)
      }
      reader.readAsText(file)
    })
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    onDrop(files)
  }

  const analyzeContract = async (fileId?: string, address?: string) => {
    setIsAnalyzing(true)

    try {
      // Simulate analysis process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      if (fileId) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "completed",
                  analysisResults: mockAnalysisResults,
                }
              : f,
          ),
        )
        toast.success("Contract analysis completed successfully")
      } else if (address) {
        // Create a new file entry for address-based analysis
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Contract ${address.slice(0, 8)}...${address.slice(-6)}`,
          size: 0,
          type: "address",
          uploadedAt: new Date(),
          status: "completed",
          progress: 100,
          analysisResults: mockAnalysisResults,
        }
        setUploadedFiles((prev) => [...prev, newFile])
        setSelectedFile(newFile)
        toast.success("Contract analysis completed successfully")
      }
    } catch (error) {
      toast.error("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const deleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
    toast.success("File deleted successfully")
  }

  const exportResults = async () => {
    if (!selectedFile?.analysisResults) {
      toast.error("No analysis results to export")
      return
    }

    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const data = selectedFile.analysisResults
      const filename = `contract-analysis-${selectedFile.name}-${Date.now()}`

      if (exportFormat === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${filename}.json`
        a.click()
        URL.revokeObjectURL(url)
      }

      toast.success(`Analysis exported as ${exportFormat.toUpperCase()}`)
    } catch (error) {
      toast.error("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "High":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "Medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "Low":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const filteredVulnerabilities =
    selectedFile?.analysisResults?.securityAnalysis.vulnerabilities.filter((vuln) => {
      const matchesSearch =
        vuln.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vuln.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSeverity = filterSeverity === "all" || vuln.severity === filterSeverity
      return matchesSearch && matchesSeverity
    }) || []

  return (
    <div className={`h-full w-full overflow-auto transition-all duration-300 ${contentPadding}`}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Contract Extractor
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Upload contracts or enter addresses for comprehensive analysis and data extraction
            </p>
          </div>

          {selectedFile?.analysisResults && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={exportFormat} onValueChange={(value: "json" | "csv" | "pdf") => setExportFormat(value)}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportResults} disabled={isExporting} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Upload & Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Contract
                </CardTitle>
                <CardDescription>Upload Cairo contract files for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">.cairo, .json, .txt files supported</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".cairo,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Contract Address Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Contract Address
                </CardTitle>
                <CardDescription>Enter a Starknet contract address for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-address">Contract Address</Label>
                  <Input
                    id="contract-address"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => analyzeContract(undefined, contractAddress)}
                  disabled={!contractAddress || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Contract"}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Analysis Options
                </CardTitle>
                <CardDescription>Configure what to analyze</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analysisOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => setAnalysisOptions((prev) => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Uploaded Files
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              file.status === "completed"
                                ? "default"
                                : file.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {file.status}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => deleteFile(file.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {file.status === "uploading" && <Progress value={file.progress} className="h-2" />}
                      {file.status === "completed" && !file.analysisResults && (
                        <Button
                          size="sm"
                          onClick={() => analyzeContract(file.id)}
                          disabled={isAnalyzing}
                          className="w-full"
                        >
                          Analyze
                        </Button>
                      )}
                      {file.analysisResults && (
                        <Button size="sm" variant="outline" onClick={() => setSelectedFile(file)} className="w-full">
                          View Results
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="lg:col-span-2">
            {selectedFile?.analysisResults ? (
              <div className="space-y-6">
                {/* Contract Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Contract Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <p className="font-medium">{selectedFile.analysisResults.contractInfo.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Type</Label>
                        <p className="font-medium">{selectedFile.analysisResults.contractInfo.type}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">Address</Label>
                        <p className="font-mono text-sm break-all">
                          {selectedFile.analysisResults.contractInfo.address}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Compiler</Label>
                        <p className="font-medium">{selectedFile.analysisResults.contractInfo.compiler}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Verified</Label>
                        <div className="flex items-center gap-2">
                          {selectedFile.analysisResults.contractInfo.verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">
                            {selectedFile.analysisResults.contractInfo.verified ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Tabs */}
                <Tabs defaultValue="security" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span className="hidden sm:inline">Performance</span>
                    </TabsTrigger>
                    <TabsTrigger value="code" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span className="hidden sm:inline">Code</span>
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span className="hidden sm:inline">Data</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="security" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Security Analysis</span>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            Score: {selectedFile.analysisResults.securityAnalysis.score}/100
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {selectedFile.analysisResults.securityAnalysis.issues.map((issue) => (
                            <div key={issue.severity} className="text-center">
                              <div className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                                <div className="flex items-center justify-center mb-1">
                                  {getSeverityIcon(issue.severity)}
                                </div>
                                <p className="text-2xl font-bold">{issue.count}</p>
                                <p className="text-xs">{issue.severity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search vulnerabilities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                              <SelectTrigger className="w-full sm:w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            {filteredVulnerabilities.map((vuln) => (
                              <Card key={vuln.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        {getSeverityIcon(vuln.severity)}
                                        <h4 className="font-medium">{vuln.title}</h4>
                                        <Badge variant="outline" className={getSeverityColor(vuln.severity)}>
                                          {vuln.severity}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">{vuln.description}</p>
                                      <p className="text-xs text-muted-foreground">Line {vuln.line}</p>
                                    </div>
                                  </div>
                                  <div className="mt-3 p-3 bg-muted rounded-lg">
                                    <p className="text-sm">
                                      <strong>Recommendation:</strong> {vuln.recommendation}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Gas Usage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Average</span>
                            <span className="font-medium">
                              {selectedFile.analysisResults.performanceMetrics.gasUsage.average.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Maximum</span>
                            <span className="font-medium">
                              {selectedFile.analysisResults.performanceMetrics.gasUsage.maximum.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Minimum</span>
                            <span className="font-medium">
                              {selectedFile.analysisResults.performanceMetrics.gasUsage.minimum.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Active Users</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Daily</span>
                            <span className="font-medium">
                              {selectedFile.analysisResults.performanceMetrics.activeUsers.daily.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Weekly</span>
                            <span className="font-medium">
                              {selectedFile.analysisResults.performanceMetrics.activeUsers.weekly.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Monthly</span>
                            <span className="font-medium">
                              {selectedFile.analysisResults.performanceMetrics.activeUsers.monthly.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedFile.analysisResults.codeAnalysis.linesOfCode.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Lines of Code</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedFile.analysisResults.codeAnalysis.functions}
                          </div>
                          <div className="text-sm text-muted-foreground">Functions</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedFile.analysisResults.codeAnalysis.complexity}
                          </div>
                          <div className="text-sm text-muted-foreground">Complexity</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedFile.analysisResults.codeAnalysis.dependencies}
                          </div>
                          <div className="text-sm text-muted-foreground">Dependencies</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedFile.analysisResults.codeAnalysis.testCoverage}%
                          </div>
                          <div className="text-sm text-muted-foreground">Test Coverage</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {selectedFile.analysisResults.codeAnalysis.documentation}%
                          </div>
                          <div className="text-sm text-muted-foreground">Documentation</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="data" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedFile.analysisResults.dataExtraction.events.map((event, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{event.name}</p>
                                  <p className="text-xs text-muted-foreground">Last seen: {event.lastSeen}</p>
                                </div>
                                <Badge variant="outline">{event.count.toLocaleString()}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Functions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedFile.analysisResults.dataExtraction.functions.map((func, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-sm">{func.name}</p>
                                  <Badge variant="outline">{func.calls.toLocaleString()}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Avg Gas: {func.gasAvg.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Selected</h3>
                  <p className="text-muted-foreground">
                    Upload a contract file or enter a contract address to begin analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
