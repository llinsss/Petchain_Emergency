import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PetChain - Decentralized Pet Medical Records",
  description:
    "Secure, blockchain-powered pet medical records with emergency QR access. Never lose your pet's important health information again.",
  keywords: ["pet", "medical records", "blockchain", "QR code", "emergency", "veterinary"],
  authors: [{ name: "PetChain Team" }],
  openGraph: {
    title: "PetChain - Decentralized Pet Medical Records",
    description: "Secure, blockchain-powered pet medical records with emergency QR access.",
    type: "website",
    url: "https://petchain.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetChain - Decentralized Pet Medical Records",
    description: "Secure, blockchain-powered pet medical records with emergency QR access.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
