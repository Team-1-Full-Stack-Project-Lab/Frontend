import { format, parseISO } from 'date-fns'
import { Calendar, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EditTripDialog } from '@/components/EditTripDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Trip } from '@/shared/types'
import { deleteTrip } from '@/services/tripService'
import { useState } from 'react'
import { Button } from './ui/button'

interface TripCardProps {
  trip: Trip
  onChangeTrips: () => void
}

export function TripCard({ trip, onChangeTrips }: TripCardProps) {
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null)

  const handleDeleteConfirm = () => {
    if (deletingTrip) {
      deleteTrip(deletingTrip.id)
      onChangeTrips()
      setDeletingTrip(null)
    }
  }

  return (
    <>
      <Card className="flex flex-col overflow-hidden h-56 bg-gradient-to-b from-blue-500 to-blue-950 p-0 cursor-pointer">
        <CardHeader className="p-2 flex flex-row justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={e => e.stopPropagation()}
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setEditingTrip(trip)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setDeletingTrip(trip)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-4 mt-auto">
          <h3 className="text-white font-bold text-xl mb-2">{trip.name}</h3>

          <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
            <MapPin className="h-4 w-4" />
            <span>{trip.destination}</span>
          </div>

          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Calendar className="h-4 w-4" />
            <span>
              {format(parseISO(trip.startDate), 'MMM d')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingTrip && (
        <EditTripDialog
          trip={editingTrip}
          open={!!editingTrip}
          onOpenChange={open => !open && setEditingTrip(null)}
          onSuccess={onChangeTrips}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTrip} onOpenChange={open => !open && setDeletingTrip(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip
              <strong className="block mt-2 text-foreground">"{deletingTrip?.name}"</strong>
              and all of its associated stays and information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Delete Trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
