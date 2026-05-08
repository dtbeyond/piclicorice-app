import type { Metadata } from "next"
import AuthGate from "@/components/AuthGate"
import "./globals.css"

export const metadata: Metadata = {
  title: "PicLicorice | Fix Your Routine",
  description: "Calm, clear skincare guidance from Aime. Understand what your routine is doing and fix what's missing.",
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
