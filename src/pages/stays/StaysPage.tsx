import { useEffect, useState } from 'react'
import { HeroSearch } from '@/components/HeroSearch'
import RentalCard from '@/components/RentalCard'
import MapCard from '@/components/MapCard'
import { useServices } from '@/hooks/useServices'
import type { Stay } from '@/types'
import { useQuery } from '@/hooks/useQuery'

export default function StaysPage() {
  const query = useQuery()
  const destination = query.get('destination')
  const travelers = query.get('travelers') || '1'
  const from = query.get('from')
  const to = query.get('to')

  const { stayService, cityService } = useServices()
  const [stays, setStays] = useState<Stay[]>([])
  const [loading, setLoading] = useState(true)
  const [cityName, setCityName] = useState<string>('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const loadStays = async () => {
      if (!destination) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await stayService.getStaysByCity(parseInt(destination), { page, size: 20 })
        setStays(response.content)
        setTotalPages(response.totalPages)

        const city = await cityService.getCityById(parseInt(destination))
        setCityName(`${city.name}, ${city.country?.name || ''}`)
      } catch (error) {
        console.error('Failed to load stays:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStays()
  }, [destination, page, stayService, cityService])

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <HeroSearch
          initialDestination={destination || undefined}
          initialFrom={from ?? undefined}
          initialTo={to ?? undefined}
          initialTravelers={travelers}
          inlineButton
          buttonOnlyIcon
          compact
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {cityName && (
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <MapCard place={cityName} />
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{cityName ? `Stays in ${cityName}` : 'Search Results'}</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-muted-foreground">Loading stays...</div>
            </div>
          ) : stays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-muted-foreground">No stays found in this city.</p>
              <p className="mt-2 text-sm text-muted-foreground">Try searching for a different destination.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6">
                {stays.map(stay => (
                  <div key={stay.id}>
                    <RentalCard stay={stay} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
