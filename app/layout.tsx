import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GossipProvider } from "@/context/gossip-context"
import { Toaster } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Celebrity Gossip Generator with Gemini",
  description: "Generate harmless, humorous fake gossip about your favorite celebrities using Google Gemini!",
    generator: 'Vishal Tambi'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GossipProvider>
          {children}
          <Toaster />
        </GossipProvider>
      </body>
    </html>
  )
}



import './globals.css'