import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteFooter } from "@/components/site-footer"
import { HukamnamaDisplay } from "@/components/hukamnama-display"
import { HukamnamaArchives } from "@/components/hukamnama-archives"
import { getHukamnamaByDate } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ArchivePageProps {
  params: {
    year: string
    month: string
    day: string
  }
}

export default async function HukamnamaArchivePage({ params }: ArchivePageProps) {
  const { year, month, day } = params
  const hukamnamaData = await getHukamnamaByDate(year, month, day)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <MobileNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                <Link href="/hukamnama">
                  <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-orange-900">
                    <span className="text-orange-600">ਹੁਕਮਨਾਮਾ</span> - Archive
                  </h1>
                  <p className="text-muted-foreground">
                    Hukamnama from {month}/{day}/{year}
                  </p>
                </div>
              </div>

              <HukamnamaDisplay hukamnamaData={hukamnamaData} />
            </div>

            <div className="space-y-6">
              <HukamnamaArchives />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
