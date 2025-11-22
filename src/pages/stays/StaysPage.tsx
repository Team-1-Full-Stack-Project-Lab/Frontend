import { useEffect, useState } from 'react'
import { HeroSearch } from '@/components/HeroSearch'
import RentalCard from '@/components/RentalCard'
import MapCard from '@/components/MapCard'
import { StaysFilters, type FilterState } from '@/components/StaysFilters'
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
  const [filteredStays, setFilteredStays] = useState<Stay[]>([])
  const [loading, setLoading] = useState(true)
  const [cityName, setCityName] = useState<string>('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<FilterState | null>(null)
  const [sortBy, setSortBy] = useState<string>('recommended')

  useEffect(() => {
    const fetchStays = async () => {
      setLoading(true)
      try {
        // If we have a destination, use the city service to find the location first
        let staysData: Stay[] = []
        let currentCityName = '';
        let currentTotalPages = 0;

        if (destination) {
          // Try to find the city first
          const cities = await cityService.getCities({ query: destination })
          if (cities.length > 0) {
            const city = cities[0]
            currentCityName = `${city.name}, ${city.country?.name || ''}`;
            // Then get stays for that city
            const response = await stayService.getStaysByCity(city.id, { page, size: 20 })
            staysData = response.content
            currentTotalPages = response.totalPages
          } else {
            // Fallback to general search if no city found (or handle as empty)
             staysData = []
             currentTotalPages = 0;
          }
        } else {
           // If no destination, maybe load some featured stays or empty
           // For now, let's load something generic or nothing
           staysData = []
           currentTotalPages = 0;
        }
        
        setStays(staysData)
        setFilteredStays(staysData) // Initial set before filters/sort
        setCityName(currentCityName)
        setTotalPages(currentTotalPages)
      } catch (error) {
        console.error('Failed to fetch stays:', error)
        toast.error("Failed to load stays. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStays()
  }, [destination, page, stayService, cityService])

  useEffect(() => {
    let result = [...stays]

    if (filters) {
      // 1. Property Name
      if (filters.propertyName) {
        const lowerName = filters.propertyName.toLowerCase()
        result = result.filter(s => s.name.toLowerCase().includes(lowerName))
      }

      // 2. Price Range
      // We need to check if ANY unit in the stay is within range
      // Or if the "min price" of the stay is within range
      const [minP, maxP] = filters.priceRange
      if (filters.priceType === 'nightly') {
         result = result.filter(s => {
           if (!s.units || s.units.length === 0) return false
           const minStayPrice = Math.min(...s.units.map(u => u.pricePerNight))
           return minStayPrice >= minP && minStayPrice <= maxP
         })
      } else {
        // Total price logic would require dates (check-in/out)
        // For now, let's assume nightly * 1 (or just use nightly as proxy if dates missing)
        // Ideally we'd use the search params dates.
        result = result.filter(s => {
           if (!s.units || s.units.length === 0) return false
           const minStayPrice = Math.min(...s.units.map(u => u.pricePerNight))
           return minStayPrice >= minP && minStayPrice <= maxP
         })
      }

      // 3. Stay Types
      if (filters.stayTypes.length > 0) {
        result = result.filter(s => s.stayType && filters.stayTypes.includes(s.stayType.id))
      }

      // 4. Amenities
      if (filters.amenities.length > 0) {
        result = result.filter(s => {
          if (!s.services) return false
          const stayServiceIds = s.services.map(srv => srv.id)
          // Check if stay has ALL selected amenities (AND logic)
          return filters.amenities.every(id => stayServiceIds.includes(id))
        })
      }

      // 5. Star Rating
      if (filters.starRatings.length > 0) {
        result = result.filter(s => {
           // Assuming rating is an integer or we floor it
           const rating = Math.floor(s.rating || 0)
           return filters.starRatings.includes(rating)
        })
      }

      // 6. Guest Rating
      if (filters.guestRating !== 'any') {
        const minRating = Number(filters.guestRating)
        result = result.filter(s => (s.rating || 0) >= minRating)
      }

      // 7. Brands (Mock logic as we don't have brand field yet, filtering by name as fallback)
      if (filters.brands.length > 0) {
        result = result.filter(s => filters.brands.some(b => s.name.includes(b)))
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => {
          const minA = Math.min(...(a.units?.map(u => u.pricePerNight) || [Infinity]))
          const minB = Math.min(...(b.units?.map(u => u.pricePerNight) || [Infinity]))
          return minA - minB
        })
        break
      case 'price_desc':
        result.sort((a, b) => {
          const minA = Math.min(...(a.units?.map(u => u.pricePerNight) || [0]))
          const minB = Math.min(...(b.units?.map(u => u.pricePerNight) || [0]))
          return minB - minA
        })
        break
      case 'rating_desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        // recommended or no sort
        break
    }

    setFilteredStays(result)
  }, [stays, filters, sortBy])

  return (
    <>
      <title>Stays</title>

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
            <aside className="hidden lg:block w-80 flex-shrink-0 space-y-6">
              <div className="sticky top-6 space-y-6">
                <MapCard place={cityName} />
                <StaysFilters 
                  onFilterChange={setFilters} 
                  stays={stays}
                />
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredStays.length} properties found {cityName ? `in ${cityName}` : ''}
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select 
                  className="text-sm border rounded-md p-1 bg-background"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Lowest Price</option>
                  <option value="price_desc">Highest Price</option>
                  <option value="rating_desc">Highest Rating</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg text-muted-foreground">Loading stays...</div>
              </div>
            ) : filteredStays.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-muted-foreground">No stays found matching your criteria.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  {filteredStays.map(stay => (
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
    </>
  )
}
