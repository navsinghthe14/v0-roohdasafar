import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Heart, BookOpen, CheckSquare, Award, MessageSquare, PenTool, HelpCircle } from "lucide-react"
import { SevaPointsWidget } from "@/components/seva-points-widget"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <MobileNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-amber-100 to-amber-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-amber-900">
                  <span className="text-orange-600">ਰੂਹ ਦਾ ਸਫ਼ਰ</span> - Rooh da Safar
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl">
                  Your spiritual journey guided by Sikh teachings
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/rooh-check">
                  <Button className="bg-orange-600 hover:bg-orange-700">Rooh Check</Button>
                </Link>
                <Link href="/hukamnama">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                    Today's Hukamnama
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter text-orange-600">App Features</h2>
              <p className="text-gray-700 md:text-lg">Tools to nurture your spiritual journey</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-orange-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-900">Rooh Check</CardTitle>
                    <Heart className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardDescription>Express your feelings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Share what's in your heart and receive personalized Gurbani guidance.</p>
                  <div className="mt-4">
                    <Link href="/rooh-check">
                      <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                        Check In
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-900">Hukamnama</CardTitle>
                    <BookOpen className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardDescription>Daily divine guidance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Receive daily Hukamnama from Sri Harmandir Sahib with interpretation.</p>
                  <div className="mt-4">
                    <Link href="/hukamnama">
                      <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                        Read Today's Hukamnama
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-900">Spiritual To-Do</CardTitle>
                    <CheckSquare className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardDescription>Track your practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Maintain a list of spiritual practices and track your progress.</p>
                  <div className="mt-4">
                    <Link href="/spiritual-todo">
                      <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                        View To-Do List
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-900">Ardaas</CardTitle>
                    <PenTool className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardDescription>Connect through prayer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Access traditional Ardaas and create personalized prayers.</p>
                  <div className="mt-4">
                    <Link href="/ardaas">
                      <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                        Offer Ardaas
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-900">Quiz</CardTitle>
                    <HelpCircle className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardDescription>Test your knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Engage with quizzes about Sikh history, philosophy, and teachings.</p>
                  <div className="mt-4">
                    <Link href="/quiz">
                      <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                        Take a Quiz
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-900">Dashboard</CardTitle>
                    <Award className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardDescription>Track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">View your Seva points and weekly spiritual progress analysis.</p>
                  <div className="mt-4">
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                        View Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-orange-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-orange-600">Your Seva Journey</h2>
                <p className="text-gray-700">
                  Earn Seva points by engaging with spiritual practices. Track your progress and grow your spiritual
                  discipline.
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">+5 points</Badge>
                    <span>Daily Rooh Check</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">+10 points</Badge>
                    <span>Reading Hukamnama</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">+15 points</Badge>
                    <span>Completing Quiz</span>
                  </div>
                </div>
                <Link href="/dashboard">
                  <Button className="bg-orange-600 hover:bg-orange-700">View Your Progress</Button>
                </Link>
              </div>

              <div className="flex-1">
                <SevaPointsWidget />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold text-orange-600">We Value Your Feedback</h2>
              <p className="text-gray-700 max-w-[600px]">
                Help us improve Rooh da Safar by sharing your suggestions and experiences.
              </p>
              <Link href="/feedback">
                <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share Feedback
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
