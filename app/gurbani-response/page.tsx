import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteFooter } from "@/components/site-footer"
import { GurbaniResponseCard } from "@/components/gurbani-response-card"
import { getLastResponse } from "@/app/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function GurbaniResponsePage() {
  const lastSubmission = await getLastResponse()

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
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-orange-900">
                <span className="text-orange-600">ਗੁਰਬਾਣੀ ਮਾਰਗਦਰਸ਼ਨ</span> - Gurbani Guidance
              </h1>
              <p className="text-muted-foreground">Wisdom from Sikh teachings to help you navigate your feelings</p>
            </div>

            {lastSubmission.feeling ? (
              <GurbaniResponseCard feeling={lastSubmission.feeling} response={lastSubmission.response} />
            ) : (
              <div className="text-center p-12 border rounded-lg bg-orange-50">
                <p className="text-lg text-orange-900">Please share your feelings first to receive Gurbani guidance.</p>
                <div className="mt-4">
                  <Link href="/rooh-check">
                    <Button className="bg-orange-600 hover:bg-orange-700">Go to Rooh Check</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
