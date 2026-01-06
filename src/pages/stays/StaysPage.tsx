import { useEffect, useState, useMemo } from 'react'
import { HeroSearch } from '@/components/HeroSearch'
import RentalCard from '@/components/Stays/RentalCard'
import MapCard from '@/components/MapCard'
import ServiceFilters from '@/components/ServiceFilters'
import PriceRangeFilter from '@/components/PriceRangeFilter'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useServices } from '@/hooks/useServices'
import type { Stay } from '@/types'
import type { DateRange } from 'react-day-picker'
import { useQuery } from '@/hooks/useQuery'
import { useTripsDrawer } from '@/hooks/useTripsDrawer'
import { SlidersHorizontal } from 'lucide-react'

export default function StaysPage() {
  const query = useQuery()
  const destination = query.get('destination')
  const travelers = query.get('travelers') || '1'
  const from = query.get('from')
  const to = query.get('to')
  const MAX_PRICE = 500

  const { stayService, cityService } = useServices()
  const { setDefaultInitialValues } = useTripsDrawer()
  const [stays, setStays] = useState<Stay[]>([])
  const [loading, setLoading] = useState(true)
  const [cityName, setCityName] = useState<string>('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [cityCoordinates, setCityCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const dateRange: DateRange | undefined = useMemo(
    () =>
      from && to
        ? {
            from: new Date(from),
            to: new Date(to),
          }
        : undefined,
    [from, to]
  )

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServiceIds(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId)
      }
      return [...prev, serviceId]
    })
    setPage(0)
  }

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    setPage(0)
  }

  useEffect(() => {
    setDefaultInitialValues({
      cityId: destination ? parseInt(destination) : undefined,
      dateRange,
    })

    return () => {
      setDefaultInitialValues(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, from, to])

  useEffect(() => {
    const loadStays = async () => {
      if (!destination) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await stayService.getAllStays({
          cityId: parseInt(destination),
          page,
          size: 20,
          serviceIds: selectedServiceIds.length > 0 ? selectedServiceIds : undefined,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < MAX_PRICE ? maxPrice : undefined,
        })
        setStays(response.content)
        setTotalPages(response.totalPages)

        const city = await cityService.getCityById(parseInt(destination))
        setCityName(`${city.name}, ${city.country?.name || ''}`)
        setCityCoordinates({ latitude: city.latitude, longitude: city.longitude })
      } catch (error) {
        console.error('Failed to load stays:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStays()
  }, [destination, page, selectedServiceIds, minPrice, maxPrice, stayService, cityService])

  return (
    <>
      <title>Stays</title>
      <section className="relative flex min-h-[600px] overflow-hidden">
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
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
                <div className="sticky top-6 space-y-4">
                  <MapCard
                    place={cityName}
                    latitude={cityCoordinates?.latitude}
                    longitude={cityCoordinates?.longitude}
                  />
                  <Card className="p-6">
                    <ServiceFilters selectedServiceIds={selectedServiceIds} onToggle={handleServiceToggle} />
                  </Card>
                  <Card className="p-6">
                    <PriceRangeFilter
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      onPriceChange={handlePriceChange}
                      defaultMin={0}
                      defaultMax={MAX_PRICE}
                    />
                  </Card>
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              <div className="mb-4 sm:mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">
                  {cityName ? `Stays in ${cityName}` : 'Search Results'}
                </h1>

                {cityName && (
                  <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 shrink-0">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">Filters</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mx-2 mb-4 space-y-6">
                        <div>
                          <MapCard
                            place={cityName}
                            latitude={cityCoordinates?.latitude}
                            longitude={cityCoordinates?.longitude}
                          />
                        </div>
                        <Card className="p-4">
                          <ServiceFilters selectedServiceIds={selectedServiceIds} onToggle={handleServiceToggle} />
                        </Card>
                        <Card className="p-4">
                          <PriceRangeFilter
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onPriceChange={handlePriceChange}
                            defaultMin={0}
                            defaultMax={MAX_PRICE}
                          />
                        </Card>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
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
                        <RentalCard
                          stay={stay}
                          initialCityId={destination ? parseInt(destination) : undefined}
                          initialDateRange={dateRange}
                        />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                      <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      </section>
    </>
  )
}
