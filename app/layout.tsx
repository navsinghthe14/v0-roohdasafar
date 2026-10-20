import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rooh da Safar — Apni rooh layi thaan banao",
  description: "Roz di soch, simran, te Sikh rehat ton prerit jeevan layi ik sohna digital saathi.",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f9f8f4",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Rooh da Safar" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pa" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
