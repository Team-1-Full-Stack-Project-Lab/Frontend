import { useState } from 'react'
import { toast } from 'sonner'
import { PenLine, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { Button } from '@/components/ui/button'
import { useServices } from '@/hooks/useServices'
import { getToken } from '@/services/rest/authService'
import type { StayUnit } from '@/types'

interface UnitsTableProps {
  units: StayUnit[]
  onEdit: (unit: StayUnit) => void
  onDelete: () => void
}

export function UnitsTable({ units, onEdit, onDelete }: UnitsTableProps) {
  const { stayService } = useServices()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<StayUnit | null>(null)

  const handleDeleteClick = (unit: StayUnit) => {
    setUnitToDelete(unit)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!unitToDelete) return

    try {
      setDeleteLoading(true)
      const token = getToken()
      if (!token) throw new Error('No token found')

      await stayService.deleteStayUnit(unitToDelete.id, token)
      toast.success('Unit deleted successfully')
      setDeleteDialogOpen(false)
      onDelete()
    } catch (error) {
      console.error('Error deleting unit:', error)
      toast.error('Failed to delete unit')
    } finally {
      setDeleteLoading(false)
      setUnitToDelete(null)
    }
  }

  if (units.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg border-dashed">
        <p className="text-muted-foreground text-sm">No units yet. Add your first unit to start receiving bookings!</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit Number</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead className="text-center">Beds</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead className="text-right">Price/Night</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map(unit => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.stayNumber}</TableCell>
                <TableCell>{unit.roomType}</TableCell>
                <TableCell className="text-center">{unit.numberOfBeds}</TableCell>
                <TableCell className="text-center">{unit.capacity}</TableCell>
                <TableCell className="text-right">${unit.pricePerNight.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(unit)}>
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(unit)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete unit "{unitToDelete?.stayNumber}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
