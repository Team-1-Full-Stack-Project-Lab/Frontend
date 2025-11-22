import { useState, useEffect } from 'react'
import { Calendar, Search } from 'lucide-react'
import { CreateTripDialog } from '@/components/CreateTripDialog'
import { useServices } from '@/hooks/useServices'
import type { Trip } from '@/types/trips'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { TripCard } from '@/components/TripCard'
import { EditTripDialog } from '@/components/EditTripDialog'
import { DeleteTripAlert } from '@/components/DeleteTripAlert'
import { TripStayUnitsDialog } from '@/components/TripStayUnitsDialog'

export default function TripsPage() {
  const { tripService } = useServices()
  const [trips, setTrips] = useState<Trip[]>([])
  const [editingTrip, setEditingTrip] = useState<Trip>()
  const [deletingTrip, setDeletingTrip] = useState<Trip>()
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null)

  const loadTrips = async () => {
    setTrips(await tripService.getTrips())
  }

  useEffect(() => {
    loadTrips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <title>My Trips</title>

      <div className="w-full max-w-6xl mx-auto my-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <CreateTripDialog onSuccess={loadTrips} />
        </div>

        {trips.length > 0 ? (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onEditTrip={setEditingTrip}
                  onDeleteTrip={setDeletingTrip}
                  onClick={setViewingTrip}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="flex flex-col items-center w-full bg-muted border-none shadow-none rounded-2xl py-10 text-center mb-6 gap-4">
            <div className="bg-[#dbe7f3] p-3 rounded-full">
              <Calendar className="w-6 h-6 text-[#003580]" />
            </div>

            <p className="text-lg text-gray-800">You have no upcoming trips. Where are you going next?</p>

            <Link to="/">
              <Button className="mt-2 bg-primary text-primary-foreground rounded-full">
                <Search /> Search
              </Button>
            </Link>
          </Card>
        )}

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
      </div>
    </>
  )
}
