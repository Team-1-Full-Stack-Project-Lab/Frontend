import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CreateTripDialog } from '@/components/CreateTripDialog'
import { getTrips } from '@/services/tripService'
import type { Stay } from '@/shared/types'
import { Plus, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SaveToTripPopoverProps {
  stay: Stay
  children: React.ReactNode
  onSaved?: () => void
}

export function SaveToTripPopover({ stay, children, onSaved }: SaveToTripPopoverProps) {
  const [trips, setTrips] = useState(getTrips())
  const [savedToIds, setSavedToIds] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      const currentTrips = getTrips()
      setTrips(currentTrips)

      // Check which trips already have this stay
      const saved = new Set<string>()
      currentTrips.forEach(trip => {
        if (trip.stays.some(s => s.id === stay.id)) {
          saved.add(trip.id)
        }
      })
      setSavedToIds(saved)
    }
  }, [open, stay.id])

  const handleAddToTrip = (tripId: string) => {
    const result = addStayToTrip(tripId, stay)
    if (result) {
      setSavedToIds(prev => new Set([...prev, tripId]))
      onSaved?.()
    }
  }

  const handleNewTripCreated = () => {
    const updated = getTrips()
    setTrips(updated)
    onSaved?.()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end" onOpenAutoFocus={e => e.preventDefault()}>
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Save to trip</h3>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {trips.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">You don't have any trips yet</p>
              <CreateTripDialog
                prefillData={{ destination: stay.location, stay }}
                onSuccess={handleNewTripCreated}
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
                      onClick={() => !isSaved && handleAddToTrip(trip.id)}
                      disabled={isSaved}
                      className="w-full px-4 py-2.5 hover:bg-gray-50 text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{trip.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {trip.destination} · {trip.stays.length} {trip.stays.length === 1 ? 'stay' : 'stays'}
                        </p>
                      </div>
                      {isSaved && <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />}
                    </button>
                  )
                })}
              </div>

              <div className="border-t p-3">
                <CreateTripDialog
                  prefillData={{ destination: stay.location, stay }}
                  onSuccess={handleNewTripCreated}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-2 justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
  )
}
