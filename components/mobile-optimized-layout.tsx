"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { isMobileDevice, getViewportHeight } from "@/lib/mobile-utils"

interface MobileOptimizedLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MobileOptimizedLayout({ children, className }: MobileOptimizedLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setViewportHeight(getViewportHeight())

    const handleResize = () => {
      setViewportHeight(getViewportHeight())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn("min-h-screen flex flex-col", isMobile && "touch-manipulation select-none", className)}
      style={{
        minHeight: isMobile ? `${viewportHeight}px` : "100vh",
      }}
    >
      {children}
    </div>
  )
}
