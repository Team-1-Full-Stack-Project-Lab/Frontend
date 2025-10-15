import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { MapPin, Users, Search } from 'lucide-react'
import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from 'react-day-picker'
import { SearchableSelect } from './SearchableSelect'

export function HeroSearch() {
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState<DateRange | undefined>()
  const [travelers, setTravelers] = useState('1')

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

  return (
    <Card className="mx-auto w-full max-w-5xl bg-white p-6 shadow-2xl">
      <div className="grid gap-4 md:grid-cols-3">
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
          <div className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="travelers"
              type="number"
              min="1"
              value={travelers}
              onChange={e => setTravelers(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
        <Search className="mr-2 h-5 w-5" />
        Search
      </Button>
    </Card>
  )
}
