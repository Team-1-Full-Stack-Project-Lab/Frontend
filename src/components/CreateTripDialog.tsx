import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import type { DateRange } from 'react-day-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { SearchableSelect, type SearchableSelectOption } from '@/components/SearchableSelect'
import { DateRangePicker } from '@/components/DateRangePicker'
import { createTrip } from '@/services/tripService'
import { ApiException } from '@/utils/exceptions'
import type { ValidationError } from '@/types/api'
import { getCities } from '@/services/cityService'
import type { GetCitiesParams } from '@/types'

interface CreateTripDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function CreateTripDialog({ trigger, onSuccess }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false)
  const [citiesOptions, setCitiesOptions] = useState<SearchableSelectOption[]>([])
  const [searchQuery, setSearchQuery] = useState<string>()
  const [name, setName] = useState('')
  const [cityId, setCityId] = useState<number>()
  const [date, setDate] = useState<DateRange>()
  const [errors, setErrors] = useState<ValidationError>({})

  const loadCities = async (params?: GetCitiesParams) => {
    const cities = await getCities(params)
    setCitiesOptions(
      cities.map(city => ({
        value: city.id.toString(),
        label: `${city.name}, ${city.country?.name || ''}`,
      }))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createTrip({
        name,
        cityId,
        startDate: date?.from?.toISOString(),
        endDate: date?.to?.toISOString(),
      })

      setName('')
      setCityId(undefined)
      setDate(undefined)
      setErrors({})
      setOpen(false)

      onSuccess?.()
    } catch (error) {
      if (error instanceof ApiException && error.status === 400 && error.apiError.errors)
        return setErrors(error.apiError.errors)
      toast.error('Failed to create trip. Please try again.')
    }
  }

  useEffect(() => {
    loadCities({ featured: true })
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
  }, [searchQuery])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="text-blue-800 hover:text-blue-500">
            <Plus /> Create Trip
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new trip</DialogTitle>
            <DialogDescription className="opacity-80">
              Plan your trip by adding destinations and dates
            </DialogDescription>
          </DialogHeader>

          <FieldSet>
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Summer Vacation 2025"
                  aria-invalid={!!errors.name}
                />
                {errors.name && errors.name.map((err, idx) => <FieldError key={idx}>{err}</FieldError>)}
              </Field>

              <Field data-invalid={!!errors.cityId}>
                <FieldLabel htmlFor="cityId">Destination</FieldLabel>
                <SearchableSelect
                  options={citiesOptions}
                  value={cityId?.toString() || ''}
                  onValueChange={value => setCityId(Number.parseInt(value))}
                  placeholder="Select a city"
                  onQueryChange={q => setSearchQuery(q)}
                />
                {errors.cityId && errors.cityId.map((err, idx) => <FieldError key={idx}>{err}</FieldError>)}
              </Field>

              <Field data-invalid={!!errors.startDate || !!errors.endDate}>
                <FieldLabel htmlFor="dates">Dates</FieldLabel>
                <DateRangePicker
                  id="dates"
                  date={date}
                  onDateChange={setDate}
                  aria-invalid={!!errors.startDate || !!errors.endDate}
                />
                {errors.startDate && errors.startDate.map((err, idx) => <FieldError key={idx}>{err}</FieldError>)}
                {errors.endDate && errors.endDate.map((err, idx) => <FieldError key={idx}>{err}</FieldError>)}
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X /> Cancel
            </Button>

            <Button type="submit" className="bg-primary text-primary-foreground">
              <Plus /> Create Trip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
