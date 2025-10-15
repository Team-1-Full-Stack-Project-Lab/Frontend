import { HeroSearch } from '@/components/HeroSearch'
import { DestinationCard } from '@/components/DestinationCard'
import { TrendingUp } from 'lucide-react'

export default function HomePage() {
  const featuredDeals = [
    {
      image: '/tokyo-japan-cherry-blossoms-city-skyline.jpg',
      title: 'Tokyo Cultural Journey',
      location: 'Tokyo, Japan',
      rating: 4.9,
      reviews: 4102,
      price: 1199,
      badge: 'Trending',
    },
    {
      image: '/paris-france-eiffel-tower-romantic-sunset.jpg',
      title: 'Romantic Paris Experience',
      location: 'Paris, France',
      rating: 4.7,
      reviews: 5234,
      price: 1099,
      originalPrice: 1399,
    },
    {
      image: '/iceland-northern-lights-aurora-mountains.jpg',
      title: 'Iceland Northern Lights',
      location: 'Reykjavik, Iceland',
      rating: 4.8,
      reviews: 2341,
      price: 1349,
    },
  ]

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDeals.map((deal, index) => (
            <DestinationCard key={index} {...deal} />
          ))}
        </div>
      </section>
    </>
  )
}
