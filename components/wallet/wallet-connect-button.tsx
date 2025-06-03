"use client"

import { useState } from "react"
import { Wallet, Copy, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function WalletConnectButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const connectWallet = async (walletType: "argent" | "braavos") => {
    const toastId = toast.loading(`Connecting to ${walletType === "argent" ? "Argent X" : "Braavos"}...`)

    setTimeout(() => {
      setIsConnected(true)
      setWalletAddress("0x1234...5678")
      toast.success(`✅ ${walletType === "argent" ? "Argent X" : "Braavos"} wallet connected`, { id: toastId })
    }, 2000)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678")
    toast.success("Address copied to clipboard")
  }

  const disconnect = () => {
    setIsConnected(false)
    setWalletAddress("")
    toast.info("Wallet disconnected")
  }

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="flex items-center gap-2 transition-all duration-200 hover:bg-accent/50"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">{walletAddress}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a href="/profile" className="flex w-full">
              View Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-red-600">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-gradient-to-r from-[#5C6AC4] to-[#22D3EE] hover:from-[#5C6AC4]/90 hover:to-[#22D3EE]/90 transition-all duration-200 shadow-lg">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>Choose a wallet to connect to the Starknet network</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={() => connectWallet("argent")}
              className="w-full justify-start bg-card hover:bg-accent border transition-all duration-200"
              variant="outline"
            >
              <div className="h-8 w-8 rounded-full bg-orange-500 mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">Argent X</div>
                <div className="text-xs text-muted-foreground">Most popular Starknet wallet</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={() => connectWallet("braavos")}
              className="w-full justify-start bg-card hover:bg-accent border transition-all duration-200"
              variant="outline"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">Braavos</div>
                <div className="text-xs text-muted-foreground">Advanced features and security</div>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
