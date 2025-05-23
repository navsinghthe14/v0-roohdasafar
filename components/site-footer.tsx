import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-orange-50">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            <span className="text-orange-600 font-medium">ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ</span> - Built with love
            for the Sikh community.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-orange-900"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-orange-900"
          >
            Terms
          </Link>
          <Link
            href="/feedback"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-orange-900"
          >
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  )
}
