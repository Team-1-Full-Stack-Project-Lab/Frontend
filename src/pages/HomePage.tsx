import { useEffect, useState } from 'react'
import { HeroSearch } from '@/components/HeroSearch'
import { PopularStaysCarousel } from '@/components/PopularDestination/PopularStaysCarousel'
import { TrendingUp, AlertCircle, Loader2, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useServices } from '@/hooks/useServices'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import type { Stay } from '@/types'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { stayService } = useServices()
  const [stays, setStays] = useState<Stay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPopularStays = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await stayService.getPopularStays()
      setStays(data)
    } catch (err) {
      console.error('Error fetching popular stays:', err)
      setError('Failed to load popular stays.   Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPopularStays()
  }, [])

  return (
    <>
      <title>Home</title>

      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden px-4 py-24">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/background.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 w-full max-w-6xl text-center">
          <h1 className="mb-4 text-balance text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Plan Your Trips
          </h1>

          <HeroSearch />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col items-center gap-4 md:flex-row">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Featured Deals</span>
            </div>
            <h2 className="text-balance text-3xl font-bold md:text-4xl">Trending Destinations</h2>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading popular stays...</span>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchPopularStays} className="shrink-0">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && stays.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No popular stays available at the moment.</p>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for exciting destinations!</p>
          </div>
        )}

        {!isLoading && !error && stays.length > 0 && <PopularStaysCarousel stays={stays} />}
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <CardContent className="relative px-4 py-8 md:px-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                  <Building2 className="h-4 w-4" />
                  <span>For Property Owners</span>
                </Badge>

                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Share Your Space, Earn Income</h2>

                <p className="text-lg text-muted-foreground">
                  Turn your property into a source of income. Join our community of hosts and start welcoming travelers
                  from around the world.
                </p>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Easy property management dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Control your listings and availability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Reach travelers worldwide</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 md:items-end">
                <Card className="bg-card/50 backdrop-blur border-primary/10">
                  <CardContent className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Getting started is easy:</p>
                    <ol className="space-y-2 text-sm">
                      <li className="flex gap-3">
                        <Badge
                          variant="secondary"
                          className="h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 p-0 text-xs font-semibold text-primary hover:bg-primary/10"
                        >
                          1
                        </Badge>
                        <span>Create your company profile</span>
                      </li>
                      <li className="flex gap-3">
                        <Badge
                          variant="secondary"
                          className="h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 p-0 text-xs font-semibold text-primary hover:bg-primary/10"
                        >
                          2
                        </Badge>
                        <span>List your properties</span>
                      </li>
                      <li className="flex gap-3">
                        <Badge
                          variant="secondary"
                          className="h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 p-0 text-xs font-semibold text-primary hover:bg-primary/10"
                        >
                          3
                        </Badge>
                        <span>Start welcoming guests</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <Button
                  size="lg"
                  className="w-full md:w-auto group"
                  onClick={() => navigate(isAuthenticated ? '/settings/company' : '/login')}
                >
                  {isAuthenticated ? 'Get Started as Host' : 'Sign In to Start'}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground text-center md:text-right">
                    New here?{' '}
                    <Button onClick={() => navigate('/register')} variant="link" className="p-0">
                      Create an account
                    </Button>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
