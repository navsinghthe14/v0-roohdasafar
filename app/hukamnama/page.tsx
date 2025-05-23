import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteFooter } from "@/components/site-footer"
import { HukamnamaDisplay } from "@/components/hukamnama-display"
import { HukamnamaArchives } from "@/components/hukamnama-archives"
import { getDailyHukamnama } from "@/app/actions"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, Download } from "lucide-react"
import Link from "next/link"

export default async function HukamnamaPage() {
  const hukamnamaData = await getDailyHukamnama()

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
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-orange-900">
                  <span className="text-orange-600">ਹੁਕਮਨਾਮਾ</span> - Hukamnama
                </h1>
                <p className="text-muted-foreground">Today's divine guidance from Sri Harmandir Sahib</p>
              </div>

              <HukamnamaDisplay hukamnamaData={hukamnamaData} />
            </div>

            <div className="space-y-6">
              <HukamnamaArchives />

              <Card className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-lg">What is Hukamnama?</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Hukamnama is a divine command or message that is read from the Guru Granth Sahib each day at Sri
                    Harmandir Sahib (Golden Temple) in Amritsar. It serves as spiritual guidance for Sikhs worldwide.
                  </p>
                  <Link
                    href="https://www.sikhnet.com/pages/what-is-hukam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    Learn more about Hukamnama
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-lg">Gurmukhi Fonts</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Download Gurmukhi fonts to properly view the Hukamnama in its original script on your device.
                  </p>
                  <Link
                    href="https://www.sikhnet.com/gurmukhi-fonts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    Download Gurmukhi Fonts
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
