import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { updateTrip } from '@/services/tripService'
import type { Trip } from '@/shared/types'

interface EditTripDialogProps {
  trip: Trip
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditTripDialog({ trip, open, onOpenChange, onSuccess }: EditTripDialogProps) {
  const [name, setName] = useState(trip.name)
  const [destination, setDestination] = useState(trip.destination)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(trip.startDate))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(trip.endDate))
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when trip changes
  useEffect(() => {
    setName(trip.name)
    setDestination(trip.destination)
    setStartDate(new Date(trip.startDate))
    setEndDate(new Date(trip.endDate))
    setErrors({})
  }, [trip])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Name is required'
    if (!destination.trim()) newErrors.destination = 'Destination is required'
    if (!startDate) newErrors.startDate = 'Start date is required'
    if (!endDate) newErrors.endDate = 'End date is required'
    if (startDate && endDate && startDate >= endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const result = updateTrip(trip.id, {
      name: name.trim(),
      destination: destination.trim(),
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
    })

    if (result) {
      onOpenChange(false)
      onSuccess?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogDescription>Update the details of your trip. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Trip Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Summer Vacation 2024"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-destination">Destination</Label>
            <Input
              id="edit-destination"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g., Paris, France"
              className={errors.destination ? 'border-red-500' : ''}
            />
            {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${errors.startDate ? 'border-red-500' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${errors.endDate ? 'border-red-500' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
