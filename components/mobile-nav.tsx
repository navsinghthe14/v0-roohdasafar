"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const isMobile = useMobile()

  if (!isMobile) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <nav className="grid gap-6 text-lg font-medium">
          <Link href="/" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/rooh-check" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Rooh Check
          </Link>
          <Link
            href="/gurbani-response"
            className="hover:text-amber-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            Gurbani Response
          </Link>
          <Link href="/hukamnama" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Hukamnama
          </Link>
          <Link
            href="/spiritual-todo"
            className="hover:text-amber-900 transition-colors"
            onClick={() => setOpen(false)}
          >
            Spiritual To-Do
          </Link>
          <Link href="/ardaas" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Ardaas
          </Link>
          <Link href="/quiz" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Quiz
          </Link>
          <Link href="/reminders" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Reminders
          </Link>
          <Link href="/dashboard" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link href="/settings" className="hover:text-amber-900 transition-colors" onClick={() => setOpen(false)}>
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
