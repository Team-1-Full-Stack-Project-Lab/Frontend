import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroSearch } from '@/components/HeroSearch'
import MapCard from '@/components/MapCard'
import RentalCard from '@/components/RentalCard'
import SearchBar from '@/components/SearchBar'
import FilterPanel from '@/components/FilterPanel'
import PriceFilter from '@/components/PriceFilter'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function TripsSearchPage() {
  const query = useQuery()
  const destination = query.get('destination') || ''
  const travelers = query.get('travelers') || '1'
  const from = query.get('from')
  const to = query.get('to')

  type Current = { destination: string; travelers: string; from?: string | null; to?: string | null }
  const [current, setCurrent] = useState<Current>({ destination, travelers, from, to })

  const rentals = [
    {
      id: 'r1',
      title: 'Cabañas Pewma Futrono',
      location: 'Futrono',
      pricePerNight: '$129 total',
      price: 129,
      tag: '$65 per night',
      images: ['/background.webp', '/paris-france-eiffel-tower-romantic-sunset.jpg'],
      filters: ['Cabaña', 'Desayuno incluido', 'Futrono'],
    },
    {
      id: 'r2',
      title: 'Entre Rios Lodge',
      location: 'Futrono',
      pricePerNight: '$609 total',
      price: 609,
      tag: '$304 per night',
      images: ['/background.webp', '/tokyo-japan-cherry-blossoms-city-skyline.jpg'],
      filters: ['Hotel', 'Alberca'],
    },
    { id: 'r3', title: 'Lago Azul Retreat', location: 'Futrono', pricePerNight: '$180 total', price: 180, tag: '$90 per night', images: ['/background.webp'], filters: ['Cabaña', 'Pago durante la estancia'] },
    { id: 'r4', title: 'Casa del Bosque', location: 'Futrono', pricePerNight: '$210 total', price: 210, tag: '$105 per night', images: ['/paris-france-eiffel-tower-romantic-sunset.jpg'], filters: ['Tina de hidromasaje', 'Cabaña'] },
    { id: 'r5', title: 'Vista Hermosa', location: 'Futrono', pricePerNight: '$150 total', price: 150, tag: '$75 per night', images: ['/tokyo-japan-cherry-blossoms-city-skyline.jpg'], filters: ['Desayuno incluido', 'Hotel'] },
    { id: 'r6', title: 'Cabañas del Sur', location: 'Futrono', pricePerNight: '$99 total', price: 99, tag: '$50 per nignt', images: ['/iceland-northern-lights-aurora-mountains.jpg'], filters: ['Acepta mascotas', 'Cabaña'] },
  ]

  const [queryStr, setQueryStr] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)

  const filtered = rentals.filter((r) => {
    const matchesText = r.title.toLowerCase().includes(queryStr.toLowerCase())
    if (!matchesText) return false

    if (activeFilters.length > 0) {
      const hasAny = r.filters?.some((f: string) => activeFilters.includes(f))
      if (!hasAny) return false
    }

    if (priceMin !== null && r.price < priceMin) return false
    if (priceMax !== null && r.price > priceMax) return false

    return true
  })

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex-1">
        <HeroSearch
          initialDestination={destination}
          initialFrom={from ?? undefined}
          initialTo={to ?? undefined}
          initialTravelers={travelers}
          onChange={payload => setCurrent(payload)}
          inlineButton
          buttonOnlyIcon
          compact
        />

        <div className="mt-6 flex items-start gap-6">
          <div className="w-72 flex-shrink-0">
            <MapCard place={current.destination || undefined} />
            <div className="mt-4 border-t border-muted-foreground/30" />

            <div className="mt-4">
              <SearchBar value={queryStr} onChange={setQueryStr} />
            </div>
            <div className="mt-4 border-t border-muted-foreground/30" />

            <div className="mt-4">
              <FilterPanel activeFilters={activeFilters} onToggle={(f) => {
                setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
              }} />
            </div>

            <div className="mt-4 border-t border-muted-foreground/30" />

            <div className="mt-4">
              <PriceFilter prices={rentals.map(r => r.price)} min={priceMin ?? 80} max={priceMax ?? 650} onChange={(min: number, max: number) => {
                setPriceMin(min)
                setPriceMax(max)
              }} />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="mb-4 text-2xl font-semibold">Trips Search</h1>

            <section className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Properties</h2>
                <div className="text-sm text-muted-foreground">{filtered.length} Properties</div>
              </div>

              <div className="grid gap-4">
                {filtered.map((r) => (
                  <div key={r.id}>
                    <RentalCard title={r.title} location={r.location} pricePerNight={r.pricePerNight} tag={r.tag} images={r.images} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
