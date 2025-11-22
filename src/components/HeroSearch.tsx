import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { MapPin, Search } from 'lucide-react'
import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from 'react-day-picker'
import { SearchableSelect, type SearchableSelectOption } from './SearchableSelect'
import { TravelersSelector, type RoomData } from './TravelersSelector'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useServices } from '@/hooks/useServices'
import type { GetCitiesParams } from '@/types'

type HeroSearchProps = {
  initialDestination?: string
  initialFrom?: string
  initialTo?: string
  initialTravelers?: string
  onChange?: (payload: { destination: string; travelers: string; from?: string | null; to?: string | null }) => void
  inlineButton?: boolean
  buttonOnlyIcon?: boolean
  compact?: boolean
}

export function HeroSearch({
  initialDestination,
  initialFrom,
  initialTo,
  initialTravelers,
  onChange,
  inlineButton = false,
  buttonOnlyIcon = false,
  compact = false,
}: HeroSearchProps) {
  const { cityService } = useServices()

  const [destination, setDestination] = useState<string>(() => initialDestination ?? '')
  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (initialFrom || initialTo) {
      return {
        from: initialFrom ? new Date(initialFrom) : undefined,
        to: initialTo ? new Date(initialTo) : undefined,
      } as DateRange
    }
    return undefined
  })
  const [rooms, setRooms] = useState<RoomData[]>(() => {
    if (initialTravelers) {
      const count = parseInt(initialTravelers, 10)
      if (!isNaN(count) && count > 0) {
        return [{ adults: count, children: 0 }]
      }
    }
    return [{ adults: 1, children: 0 }]
  })
  const travelers = rooms.reduce((acc, room) => acc + room.adults + room.children, 0).toString()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [citiesOptions, setCitiesOptions] = useState<SearchableSelectOption[]>([])
  const [searchQuery, setSearchQuery] = useState<string>()

  const loadCities = async (params?: GetCitiesParams) => {
    const cities = await cityService.getCities(params)
    setCitiesOptions(
      cities.map(city => ({
        value: city.id.toString(),
        label: `${city.name}, ${city.country?.name || ''}`,
      }))
    )
  }

  useEffect(() => {
    if (onChange) {
      onChange({
        destination,
        travelers,
        from: date?.from ? new Date(date.from).toISOString() : null,
        to: date?.to ? new Date(date.to).toISOString() : null,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, travelers, date])

  useEffect(() => {
    loadCities({ featured: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!searchQuery || searchQuery.trim() === '') {
        loadCities({ featured: true })
      } else {
        loadCities({ name: searchQuery })
      }
    }, 300)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // Keep 3 columns and place the inline button inside the travelers column
  const gridCols = 'md:grid-cols-3'

  if (compact) {
    return (
      <div className="flex flex-col md:flex-row w-full items-stretch md:items-center gap-3 md:gap-4">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SearchableSelect
            className="!pl-10"
            options={citiesOptions}
            value={destination}
            onValueChange={setDestination}
            placeholder="Where to?"
            onQueryChange={q => setSearchQuery(q)}
          />
        </div>

        <div className="relative flex-1">
          <DateRangePicker date={date} onDateChange={setDate} />
        </div>

        <div className="relative flex-1">
          <TravelersSelector
            initialRooms={rooms}
            onChange={(_, newRooms) => setRooms(newRooms)}
          />
        </div>

        <Button
          className="w-full md:w-12 md:h-12 md:ml-2 h-10 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center shadow-lg"
          onClick={() => {
            const hasDestination = Boolean(destination)
            const hasDateRange = Boolean(date?.from && date?.to)

            if (!hasDestination || !hasDateRange) {
              setError('Please select a destination and a trip date range before searching.')
              setOpen(true)
              return
            }

            setError(null)
            const params = new URLSearchParams()
            if (destination) params.set('destination', destination)
            if (travelers) params.set('travelers', travelers)
            if (date?.from) params.set('from', new Date(date.from).toISOString())
            if (date?.to) params.set('to', new Date(date.to).toISOString())

            navigate(`/stays?${params.toString()}`)
          }}
        >
          <Search className="h-5 w-5 md:mr-0 mr-2" />
          <span className="md:hidden">Search</span>
        </Button>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Incomplete search</AlertDialogTitle>
              <AlertDialogDescription>
                {error ?? 'Please select a destination and a trip date range before searching.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction onClick={() => setOpen(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-5xl bg-white dark:bg-card p-6 shadow-2xl">
      <div className={`grid gap-4 ${gridCols}`}>
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-medium">
            Destination
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <SearchableSelect
              className="!pl-10"
              options={citiesOptions}
              value={destination}
              onValueChange={setDestination}
              placeholder="Where to?"
              onQueryChange={q => setSearchQuery(q)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="check-in" className="text-sm font-medium">
            Trip dates
          </Label>
          <div className="relative">
            <DateRangePicker date={date} onDateChange={setDate} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers" className="text-sm font-medium">
            Travelers
          </Label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <TravelersSelector
                initialRooms={rooms}
                onChange={(_, newRooms) => setRooms(newRooms)}
              />
            </div>

            {inlineButton && (
              <div className="ml-3">
                <Button
                  className={
                    buttonOnlyIcon
                      ? 'p-2 w-12 h-10 flex items-center justify-center'
                      : 'w-full bg-primary text-primary-foreground hover:bg-primary/90'
                  }
                  size={buttonOnlyIcon ? 'sm' : 'lg'}
                  onClick={() => {
                    const hasDestination = Boolean(destination)
                    const hasDateRange = Boolean(date?.from && date?.to)

                    if (!hasDestination || !hasDateRange) {
                      setError('Please select a destination and a trip date range before searching.')
                      setOpen(true)
                      return
                    }

                    setError(null)
                    const params = new URLSearchParams()
                    if (destination) params.set('destination', destination)
                    if (travelers) params.set('travelers', travelers)
                    if (date?.from) params.set('from', new Date(date.from).toISOString())
                    if (date?.to) params.set('to', new Date(date.to).toISOString())

                    navigate(`/stays?${params.toString()}`)
                  }}
                >
                  <Search className={`${buttonOnlyIcon ? '' : 'mr-2 h-5 w-5'}`} />
                  {!buttonOnlyIcon && 'Search'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!inlineButton && (
        <Button
          className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
          onClick={() => {
            const hasDestination = Boolean(destination)
            const hasDateRange = Boolean(date?.from && date?.to)

            if (!hasDestination || !hasDateRange) {
              setError('Please select a destination and a trip date range before searching.')
              setOpen(true)
              return
            }

            setError(null)
            const params = new URLSearchParams()
            if (destination) params.set('destination', destination)
            if (travelers) params.set('travelers', travelers)
            if (date?.from) params.set('from', new Date(date.from).toISOString())
            if (date?.to) params.set('to', new Date(date.to).toISOString())

            navigate(`/stays?${params.toString()}`)
          }}
        >
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      )}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Incomplete search</AlertDialogTitle>
            <AlertDialogDescription>
              {error ?? 'Please select a destination and a trip date range before searching.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
