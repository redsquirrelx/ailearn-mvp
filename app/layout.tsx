import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// Added shared header and toast provider
import { SharedHeader } from "@/components/shared-header"
import { ToastProvider } from "@/components/toast-provider"

export const metadata = {
  title: "AILearn - Plataforma de Microlearning Adaptativo",
  description: "Aprende de forma personalizada con inteligencia artificial",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {/* Wrapped app with ToastProvider and added SharedHeader */}
        <ToastProvider>
          <SharedHeader />
          {children}
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}
