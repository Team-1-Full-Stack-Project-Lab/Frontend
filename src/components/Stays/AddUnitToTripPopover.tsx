import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CreateTripDialog } from '@/components/Trips/CreateTripDialog'
import { DateRangePicker } from '@/components/DateRangePicker'
import { useServices } from '@/hooks/useServices'
import type { Trip, StayUnitResponse } from '@/types'
import type { DateRange } from 'react-day-picker'
import { Plus, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface AddUnitToTripPopoverProps {
  unit: StayUnitResponse
  children: React.ReactNode
  onSaved?: () => void
  initialCityId?: number
  initialDateRange?: DateRange
}

export function AddUnitToTripPopover({
  unit,
  children,
  onSaved,
  initialCityId,
  initialDateRange,
}: AddUnitToTripPopoverProps) {
  const { tripService } = useServices()

  const [trips, setTrips] = useState<Trip[]>([])
  const [savedToIds, setSavedToIds] = useState<Set<number>>(new Set())
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [showDateDialog, setShowDateDialog] = useState(false)

  useEffect(() => {
    if (open) {
      loadTrips()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const loadTrips = async () => {
    try {
      setLoading(true)
      const currentTrips = await tripService.getTrips()
      setTrips(currentTrips)

      // TODO: Check which trips already have this unit
      setSavedToIds(new Set())
    } catch (error) {
      console.error('Failed to load trips:', error)
      toast.error('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const handleTripClick = (tripId: number) => {
    setSelectedTripId(tripId)
    setDateRange(undefined)
    setShowDateDialog(true)
  }

  const handleConfirmDates = async () => {
    if (!selectedTripId || !dateRange?.from || !dateRange?.to) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    try {
      await tripService.addStayUnitToTrip(selectedTripId, {
        stayUnitId: unit.id,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      })

      setSavedToIds(prev => new Set([...prev, selectedTripId]))
      toast.success(`Unit added to trip!`)
      setShowDateDialog(false)
      setOpen(false)
      onSaved?.()
    } catch (error) {
      console.error('Failed to add unit to trip:', error)
      toast.error('Failed to add unit to trip')
    }
  }

  const handleNewTripCreated = () => {
    loadTrips()
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end" onOpenAutoFocus={e => e.preventDefault()}>
          <div className="p-3 border-b">
            <h3 className="font-semibold text-sm">Add to trip</h3>
            <p className="text-xs text-muted-foreground mt-1">Unit #{unit.stayNumber}</p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Loading trips...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">You don't have any trips yet</p>
                <CreateTripDialog
                  onSuccess={handleNewTripCreated}
                  initialCityId={initialCityId}
                  initialDateRange={initialDateRange}
                  trigger={
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Create your first trip
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="py-1">
                  {trips.map(trip => {
                    const isSaved = savedToIds.has(trip.id)
                    return (
                      <button
                        key={trip.id}
                        onClick={() => !isSaved && handleTripClick(trip.id)}
                        disabled={isSaved}
                        className="w-full px-4 py-2.5 hover:bg-accent text-left flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{trip.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{trip.destination}</p>
                        </div>
                        {isSaved && <Check className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>

                <div className="border-t p-3">
                  <CreateTripDialog
                    onSuccess={handleNewTripCreated}
                    initialCityId={initialCityId}
                    initialDateRange={initialDateRange}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2 justify-start text-primary hover:text-primary hover:bg-accent"
                      >
                        <Plus className="h-4 w-4" />
                        Create new trip
                      </Button>
                    }
                  />
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Stay Dates</DialogTitle>
            <DialogDescription>Choose your check-in and check-out dates for this unit</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Check-in and Check-out</label>
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Unit:</span>
                <span className="font-medium">
                  #{unit.stayNumber} - {unit.roomType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per night:</span>
                <span className="font-medium">${unit.pricePerNight.toFixed(2)}</span>
              </div>
              {dateRange?.from && dateRange?.to && (
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <span className="text-muted-foreground">
                    Total ({Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))}{' '}
                    nights):
                  </span>
                  <span className="font-bold">
                    $
                    {(
                      Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) *
                      unit.pricePerNight
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDates} disabled={!dateRange?.from || !dateRange?.to}>
              Add to Trip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
