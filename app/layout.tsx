import type { Metadata } from "next"
import AuthGate from "@/components/AuthGate"
import "./globals.css"

export const metadata: Metadata = {
  title: "PicLicorice | Your Finest Era",
  description: "Calm, clear skincare guidance from Aime. Build a simple rhythm and choose what belongs.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  )
}
