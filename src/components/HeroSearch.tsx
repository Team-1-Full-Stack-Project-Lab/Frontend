import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { MapPin, Users, Search } from 'lucide-react'
import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from 'react-day-picker'
import { SearchableSelect } from './SearchableSelect'
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
  const [travelers, setTravelers] = useState<string>(() => initialTravelers ?? '1')
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

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

  const cities = [
    { value: 'paris', label: 'Paris, France' },
    { value: 'tokyo', label: 'Tokyo, Japan' },
    { value: 'new-york', label: 'New York, USA' },
    { value: 'london', label: 'London, UK' },
    { value: 'sydney', label: 'Sydney, Australia' },
    { value: 'rome', label: 'Rome, Italy' },
    { value: 'barcelona', label: 'Barcelona, Spain' },
    { value: 'dubai', label: 'Dubai, UAE' },
    { value: 'bali', label: 'Bali, Indonesia' },
    { value: 'cape-town', label: 'Cape Town, South Africa' },
    { value: 'reykjavik', label: 'Reykjavik, Iceland' },
    { value: 'santiago-chile', label: 'Santiago de Chile, Chile' },
  ]

  // Keep 3 columns and place the inline button inside the travelers column
  const gridCols = 'md:grid-cols-3'

  if (compact) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-white">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <SearchableSelect
                options={cities}
                value={destination}
                onValueChange={setDestination}
                placeholder="¿A dónde quieres ir?"
                className="min-w-0 flex-1"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="border rounded-lg px-4 py-2 bg-white">
              <DateRangePicker date={date} onDateChange={setDate} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-white">
              <Users className="h-5 w-5 text-muted-foreground" />
              <Input
                id="travelers"
                type="number"
                min="1"
                value={travelers}
                onChange={e => setTravelers(e.target.value)}
                className="w-40 h-8"
              />
            </div>
          </div>

          <div>
            <Button
              className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
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

                navigate(`/trips-search?${params.toString()}`)
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

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
    <Card className="mx-auto w-full max-w-5xl bg-white p-6 shadow-2xl">
      <div className={`grid gap-4 ${gridCols}`}>
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-medium">
            Destination
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <SearchableSelect
              className="!pl-10"
              options={cities}
              value={destination}
              onValueChange={setDestination}
              placeholder="Where to?"
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
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="travelers"
                type="number"
                min="1"
                value={travelers}
                onChange={e => setTravelers(e.target.value)}
                className="pl-10 w-full h-10"
              />
            </div>

            {inlineButton && (
              <div className="ml-3">
                <Button
                  className={buttonOnlyIcon ? 'p-2 w-12 h-10 flex items-center justify-center' : 'w-full bg-primary text-primary-foreground hover:bg-primary/90'}
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

                    navigate(`/trips-search?${params.toString()}`)
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

            navigate(`/trips-search?${params.toString()}`)
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
