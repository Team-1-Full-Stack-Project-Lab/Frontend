import { useState, useEffect } from 'react'
import { Calendar, Search } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { CreateTripDialog } from './CreateTripDialog'
import { useServices } from '@/hooks/useServices'
import type { Trip } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TripCard } from './TripCard'
import { EditTripDialog } from './EditTripDialog'
import { DeleteTripAlert } from './DeleteTripAlert'
import { TripStayUnitsDialog } from './TripStayUnitsDialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Link } from 'react-router-dom'

interface TripsDrawerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialCityId?: number
  initialDateRange?: DateRange
}

export function TripsDrawer({ children, open, onOpenChange, initialCityId, initialDateRange }: TripsDrawerProps) {
  const { tripService } = useServices()
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripStayCounts, setTripStayCounts] = useState<Record<number, number>>({})
  const [editingTrip, setEditingTrip] = useState<Trip>()
  const [deletingTrip, setDeletingTrip] = useState<Trip>()
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null)

  const loadTrips = async () => {
    const loadedTrips = await tripService.getTrips()
    setTrips(loadedTrips)

    const counts: Record<number, number> = {}
    await Promise.all(
      loadedTrips.map(async trip => {
        try {
          const stayUnits = await tripService.getTripStayUnits(trip.id)
          counts[trip.id] = stayUnits.length
        } catch {
          counts[trip.id] = 0
        }
      })
    )
    setTripStayCounts(counts)
  }

  useEffect(() => {
    if (open) {
      loadTrips()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="w-full sm:max-w-2xl">
          <div className="overflow-y-auto h-full">
            <DrawerHeader className="sticky top-0 bg-background z-10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-2xl">My Trips</DrawerTitle>
                  <DrawerDescription>Manage your travel plans</DrawerDescription>
                </div>
                <CreateTripDialog
                  onSuccess={loadTrips}
                  initialCityId={initialCityId}
                  initialDateRange={initialDateRange}
                />
              </div>
            </DrawerHeader>

            <div className="p-4">
              {trips.length > 0 ? (
                <div className="space-y-4">
                  {trips.map(trip => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onEditTrip={setEditingTrip}
                      onDeleteTrip={setDeletingTrip}
                      onClick={setViewingTrip}
                      staysCount={tripStayCounts[trip.id]}
                    />
                  ))}
                </div>
              ) : (
                <Card className="flex flex-col items-center w-full bg-muted border-none shadow-none rounded-2xl py-10 text-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>

                  <p className="text-lg text-foreground">You have no upcoming trips. Where are you going next?</p>

                  <DrawerClose asChild>
                    <Link to="/">
                      <Button className="mt-2 bg-primary text-primary-foreground rounded-full">
                        <Search /> Search
                      </Button>
                    </Link>
                  </DrawerClose>
                </Card>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {editingTrip && (
        <EditTripDialog
          trip={editingTrip}
          open={!!editingTrip}
          onOpenChange={open => !open && setEditingTrip(undefined)}
          onSuccess={() => {
            loadTrips()
            setEditingTrip(undefined)
          }}
        />
      )}

      {deletingTrip && (
        <DeleteTripAlert
          trip={deletingTrip}
          open={!!deletingTrip}
          onOpenChange={open => !open && setDeletingTrip(undefined)}
          onSuccess={() => {
            loadTrips()
            setDeletingTrip(undefined)
          }}
        />
      )}

      <TripStayUnitsDialog
        trip={viewingTrip}
        open={!!viewingTrip}
        onOpenChange={open => !open && setViewingTrip(null)}
      />
    </>
  )
}
