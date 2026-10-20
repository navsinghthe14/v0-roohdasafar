import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rooh da Safar — Make room for what matters",
  description: "A thoughtful workspace for daily reflection, spiritual practice, and guidance rooted in Sikh teachings.",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f9f8f4",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Rooh da Safar" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
