import { useEffect, useState } from 'react'
import { HeroSearch } from '@/components/HeroSearch'
import { PopularStaysCarousel } from '@/components/PopularDestination/PopularStaysCarousel'
import { TrendingUp, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useServices } from '@/hooks/useServices'
import type { Stay } from '@/types'

export default function HomePage() {
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
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPopularStays}
                className="shrink-0"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && stays.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No popular stays available at the moment.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for exciting destinations!
            </p>
          </div>
        )}

        {!isLoading && !error && stays.length > 0 && (
          <PopularStaysCarousel stays={stays} />
        )}
      </section>
    </>
  )
}
