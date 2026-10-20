import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Heart,
  Menu,
  PenLine,
  Sparkles,
  Target,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const modules = [
  { icon: Heart, label: "Rooh Check", detail: "Reflective check-ins", href: "/rooh-check", tone: "bg-coral" },
  { icon: BookOpen, label: "Hukamnama", detail: "Daily guidance", href: "/hukamnama", tone: "bg-blue" },
  { icon: Target, label: "Spiritual To-Do", detail: "Build consistent practice", href: "/spiritual-todo", tone: "bg-lime" },
  { icon: PenLine, label: "Ardaas", detail: "Make space for prayer", href: "/ardaas", tone: "bg-violet" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Rooh da Safar home">
            <span className="grid size-9 place-items-center rounded-xl bg-foreground text-background">
              <Sparkles className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Rooh da Safar</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Primary navigation">
            <Link href="#platform" className="transition-colors hover:text-foreground">Platform</Link>
            <Link href="#workflow" className="transition-colors hover:text-foreground">How it works</Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">Sign in</Link>
            <Link href="/onboarding"><Button size="sm" className="rounded-full px-5">Get started <ArrowRight data-icon="inline-end" /></Button></Link>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu /></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[32rem] rounded-full bg-blue/10 blur-3xl" />
          <div className="relative grid items-end gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge variant="outline" className="mb-7 rounded-full border-border bg-card px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Ik shaant jagah, apne andar layi
              </Badge>
              <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[6.8rem]">
                Apni rooh layi <span className="text-blue">thaan banao.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Roz di soch, simran, te Sikh rehat ton prerit jeevan layi ik sohna digital saathi.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/rooh-check"><Button size="lg" className="h-12 rounded-full px-6">Rooh Check shuru karo <ArrowRight data-icon="inline-end" /></Button></Link>
                <Link href="#platform"><Button size="lg" variant="outline" className="h-12 rounded-full px-6">Platform vekho</Button></Link>
              </div>
              <div className="mt-9 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <span className="grid size-7 place-items-center rounded-full border-2 border-background bg-blue text-[10px] font-bold text-white">AM</span>
                  <span className="grid size-7 place-items-center rounded-full border-2 border-background bg-lime text-[10px] font-bold">SK</span>
                  <span className="grid size-7 place-items-center rounded-full border-2 border-background bg-violet text-[10px] font-bold text-white">JP</span>
                </div>
                <span>Built for a more intentional everyday</span>
              </div>
            </div>
            <div className="relative lg:pb-3">
              <div className="rounded-[2rem] border border-border bg-card p-3 shadow-2xl shadow-blue/10">
                <div className="rounded-[1.5rem] bg-ink p-5 text-white sm:p-7">
                  <div className="flex items-center justify-between text-xs text-white/50"><span>MONDAY, OCT 19</span><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-lime" /> Your space</span></div>
                  <div className="mt-14"><p className="text-sm text-white/55">Good morning, friend.</p><p className="mt-2 max-w-sm text-3xl font-medium leading-tight tracking-[-0.04em]">What is present for you today?</p></div>
                  <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5"><span className="text-sm text-white/50">2 minute reflection</span><Link href="/rooh-check" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">Begin <ArrowRight className="size-4" /></Link></div>
                </div>
              </div>
              <div className="absolute -bottom-7 -left-5 hidden items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:flex"><span className="grid size-9 place-items-center rounded-xl bg-lime/20 text-ink"><CheckCircle2 className="size-5" /></span><div><p className="text-sm font-semibold">7 day streak</p><p className="text-xs text-muted-foreground">Small steps, held daily</p></div></div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-border/70 bg-secondary/40">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue">Sadda platform</p><h2 className="mt-4 max-w-sm text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Dikhave layi nahi, asli abhyaas layi.</h2></div><div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">{modules.map(({ icon: Icon, label, detail, href, tone }) => <Link key={label} href={href} className="group bg-card p-7 transition-colors hover:bg-background"><div className={`mb-12 grid size-11 place-items-center rounded-2xl ${tone}`}><Icon className="size-5 text-ink" /></div><p className="font-semibold">{label}</p><p className="mt-2 text-sm text-muted-foreground">{detail}</p><ArrowRight className="mt-7 size-4 text-muted-foreground transition-transform group-hover:translate-x-1" /></Link>)}</div></div>
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="grid gap-14 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue">Ik changi lay</p><h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Clarity compounds when you give it a place to land.</h2><p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">Rooh da Safar brings your reflection, learning, and daily commitments into one quiet, connected flow.</p><Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline decoration-border underline-offset-8 hover:decoration-foreground">See your dashboard <ArrowRight className="size-4" /></Link></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl bg-ink p-6 text-white sm:col-span-2"><BarChart3 className="size-6 text-lime" /><p className="mt-16 text-2xl font-medium tracking-[-0.03em]">Your progress, without the pressure.</p><p className="mt-2 text-sm text-white/55">Notice patterns. Celebrate consistency. Return when you need to.</p></div><div className="rounded-3xl bg-blue p-6 text-white"><Users className="size-6" /><p className="mt-10 font-medium">Personal by design</p><p className="mt-2 text-sm text-white/70">A space that meets you where you are.</p></div><div className="rounded-3xl bg-lime p-6"><CircleHelp className="size-6" /><p className="mt-10 font-medium">Always a next step</p><p className="mt-2 text-sm text-ink/60">Gentle prompts for the road ahead.</p></div></div></div></section>
      </main>
      <footer className="border-t border-border/70"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="font-medium text-foreground">Rooh da Safar</span><span>Made for the journey inward.</span><Link href="/feedback" className="hover:text-foreground">Share feedback <ArrowRight className="ml-1 inline size-3" /></Link></div></footer>
    </div>
  )
}
