import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { updateItinerary } from '@/services/itineraryService'
import type { Itinerary } from '@/shared/types'

interface EditItineraryDialogProps {
  itinerary: Itinerary
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditItineraryDialog({
  itinerary,
  open,
  onOpenChange,
  onSuccess,
}: EditItineraryDialogProps) {
  const [name, setName] = useState(itinerary.name)
  const [destination, setDestination] = useState(itinerary.destination)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(itinerary.startDate))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(itinerary.endDate))
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when itinerary changes
  useEffect(() => {
    setName(itinerary.name)
    setDestination(itinerary.destination)
    setStartDate(new Date(itinerary.startDate))
    setEndDate(new Date(itinerary.endDate))
    setErrors({})
  }, [itinerary])

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

    const result = updateItinerary(itinerary.id, {
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
          <DialogTitle>Edit Itinerary</DialogTitle>
          <DialogDescription>
            Update the details of your itinerary. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Itinerary Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setDestination(e.target.value)}
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
                    className={`w-full justify-start text-left font-normal ${
                      errors.startDate ? 'border-red-500' : ''
                    }`}
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
                    className={`w-full justify-start text-left font-normal ${
                      errors.endDate ? 'border-red-500' : ''
                    }`}
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
