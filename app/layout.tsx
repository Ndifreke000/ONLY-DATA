import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { DuneSidebar } from "@/components/sidebar/sidebar"
import { Header } from "@/components/header/header"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Toaster } from "sonner"
import { HackathonBanner } from "@/components/hackathon/hackathon-banner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "Starklytics - Your Home for Only Data",
  description:
    "A cutting-edge platform for uploading, analyzing, and visualizing smart contract data, leveraging Starknet's scalability and zero-knowledge technology.",
  keywords: ["Starknet", "Smart Contracts", "Data Analytics", "ZK Technology", "Blockchain", "DeFi"],
  authors: [{ name: "Starklytics Team" }],
  openGraph: {
    title: "Starklytics - Your Home for Only Data",
    description: "Cutting-edge smart contract data analytics on Starknet",
    type: "website",
    url: "https://starklytics.com",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased h-full overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden bg-background">
              <DuneSidebar />
              <SidebarInset className="flex flex-col min-w-0 flex-1 h-full overflow-hidden">
                <HackathonBanner />
                <Header />
                <main className="flex-1 overflow-auto w-full h-full bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/10">
                  <div className="h-full w-full min-h-0">{children}</div>
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster theme="system" position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
