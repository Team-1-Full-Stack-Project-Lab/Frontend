import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bed, Users, Calendar, MapPin, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useServices } from '@/hooks/useServices'
import type { Trip, TripStayUnit } from '@/types/trips'
import { format, parseISO } from 'date-fns'

interface TripStayUnitsDialogProps {
  trip: Trip | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TripStayUnitsDialog({ trip, open, onOpenChange }: TripStayUnitsDialogProps) {
  const { tripService } = useServices()
  const navigate = useNavigate()
  const [stayUnits, setStayUnits] = useState<TripStayUnit[]>([])
  const [loading, setLoading] = useState(false)

  const loadStayUnits = useCallback(async () => {
    if (!trip) return

    try {
      setLoading(true)
      const units = await tripService.getTripStayUnits(trip.id)
      setStayUnits(units)
    } catch (error) {
      console.error('Failed to load stay units:', error)
    } finally {
      setLoading(false)
    }
  }, [trip, tripService])

  useEffect(() => {
    if (open && trip) {
      loadStayUnits()
    }
  }, [open, trip, loadStayUnits])

  const handleRemoveUnit = async (stayUnitId: number) => {
    if (!trip) return

    try {
      await tripService.removeStayUnitFromTrip(trip.id, stayUnitId)
      toast.success('Stay unit removed from trip')
      loadStayUnits() // Reload the list
    } catch (error) {
      console.error('Failed to remove stay unit:', error)
      toast.error('Failed to remove stay unit from trip')
    }
  }

  if (!trip) return null

  const totalCost = stayUnits.reduce((sum, tsu) => {
    const nights = Math.ceil(
      (new Date(tsu.endDate).getTime() - new Date(tsu.startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    return sum + tsu.stayUnit.pricePerNight * nights
  }, 0)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{trip.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {trip.destination}
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4" />
              {format(parseISO(trip.startDate), 'MMM d')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg text-muted-foreground">Loading accommodations...</div>
              </div>
            ) : stayUnits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Bed className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg text-muted-foreground mb-2">No accommodations added yet</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Search for stays and add units to your trip to see them here
                </p>
                <Button onClick={() => navigate('/')}>
                  Start Searching
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Your Accommodations ({stayUnits.length})</h3>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total Estimated Cost</div>
                      <div className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {stayUnits.map(tsu => {
                      const nights = Math.ceil(
                        (new Date(tsu.endDate).getTime() - new Date(tsu.startDate).getTime()) / (1000 * 60 * 60 * 24)
                      )
                      const subtotal = tsu.stayUnit.pricePerNight * nights

                      return (
                        <Card key={tsu.stayUnit.id} className="p-4 relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveUnit(tsu.stayUnit.id)}
                            title="Remove from trip"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-start justify-between gap-4 pr-8">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{tsu.stayUnit.roomType}</h4>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Bed className="h-4 w-4" />
                                  <span>
                                    {tsu.stayUnit.numberOfBeds} {tsu.stayUnit.numberOfBeds === 1 ? 'bed' : 'beds'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>
                                    Up to {tsu.stayUnit.capacity} {tsu.stayUnit.capacity === 1 ? 'guest' : 'guests'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-md w-fit">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(parseISO(tsu.startDate), 'MMM d')} -{' '}
                                  {format(parseISO(tsu.endDate), 'MMM d, yyyy')}
                                  <span className="ml-2 text-blue-600">
                                    ({nights} {nights === 1 ? 'night' : 'nights'})
                                  </span>
                                </span>
                              </div>

                              <p className="text-xs text-muted-foreground mt-2">Unit #{tsu.stayUnit.stayNumber}</p>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                ${tsu.stayUnit.pricePerNight.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">per night</div>
                              <div className="pt-2 border-t">
                                <div className="text-sm text-muted-foreground">Subtotal</div>
                                <div className="text-xl font-bold">${subtotal.toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
