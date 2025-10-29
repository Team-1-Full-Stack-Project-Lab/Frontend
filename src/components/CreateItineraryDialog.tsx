import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import type { Stay } from '@/shared/types'
import { createItinerary } from '@/services/itineraryService'
import { cn } from '@/lib/utils'

interface CreateItineraryDialogProps {
  trigger?: React.ReactNode
  prefillData?: {
    destination?: string
    stay?: Stay
  }
  onSuccess?: () => void
}

export function CreateItineraryDialog({ trigger, prefillData, onSuccess }: CreateItineraryDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [destination, setDestination] = useState(prefillData?.destination || '')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Itinerary name is required'
    }

    if (!destination.trim()) {
      newErrors.destination = 'Destination is required'
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      createItinerary({
        name,
        destination,
        startDate: startDate!.toISOString(),
        endDate: endDate!.toISOString(),
        stay: prefillData?.stay,
      })

      // Reset form
      setName('')
      setDestination(prefillData?.destination || '')
      setStartDate(undefined)
      setEndDate(undefined)
      setErrors({})
      setOpen(false)

      onSuccess?.()
    } catch (error) {
      setErrors({ submit: 'Failed to create itinerary. Please try again.' })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="text-blue-800 hover:text-blue-500">
            + Create Itinerary
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <h2 className="text-2xl font-bold text-gray-900">Create a new itinerary</h2>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-gray-600 text-sm mb-4">
              Plan your trip by adding destinations and dates
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Itinerary Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Vacation 2025"
              className={cn(errors.name && 'border-red-500')}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Paris, France"
              className={cn(errors.destination && 'border-red-500')}
            />
            {errors.destination && <p className="text-sm text-red-500 mt-1">{errors.destination}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground',
                      errors.startDate && 'border-red-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground',
                      errors.endDate && 'border-red-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {prefillData?.stay && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-900">Adding stay:</p>
              <p className="text-blue-700">{prefillData.stay.title}</p>
            </div>
          )}

          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Itinerary
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
