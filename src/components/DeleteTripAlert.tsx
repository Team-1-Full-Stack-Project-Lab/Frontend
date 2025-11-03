import { toast } from 'sonner'
import { Trash2, X } from 'lucide-react'
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

interface DeleteTripDialogProps {
  trip: Trip
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteTripAlert({ trip, open, onOpenChange, onSuccess }: DeleteTripDialogProps) {
  const handleDelete = async () => {
    try {
      await deleteTrip(trip.id)
      onSuccess?.()
    } catch (_error) {
      toast.error('Failed to delete trip. Please try again.')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your trip{' '}
            <strong className="mt-2 text-foreground">"{trip.name}"</strong> and all of its associated stays and
            information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <X /> Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20"
          >
            <Trash2 /> Delete Trip
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
