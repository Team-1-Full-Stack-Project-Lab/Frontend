import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, PenLine, Trash2 } from 'lucide-react'
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
import type { Stay } from '@/types'

interface StaysTableProps {
  stays: Stay[]
  onDelete: () => void
}

export function StaysTable({ stays, onDelete }: StaysTableProps) {
  const navigate = useNavigate()
  const { stayService } = useServices()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [stayToDelete, setStayToDelete] = useState<Stay | null>(null)

  const handleDeleteClick = (stay: Stay) => {
    setStayToDelete(stay)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!stayToDelete) return

    try {
      setDeleteLoading(true)
      const token = getToken()
      if (!token) throw new Error('No token found')

      await stayService.deleteStay(stayToDelete.id, token)
      toast.success('Stay deleted successfully')
      setDeleteDialogOpen(false)
      onDelete()
    } catch (error) {
      console.error('Error deleting stay:', error)
      toast.error('Failed to delete stay')
    } finally {
      setDeleteLoading(false)
      setStayToDelete(null)
    }
  }

  if (stays.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <p className="text-muted-foreground">No stays found. Create your first property!</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Units</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stays.map(stay => (
              <TableRow key={stay.id}>
                <TableCell>
                  {stay.images?.[0]?.link ? (
                    <img src={stay.images[0].link} alt={stay.name} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{stay.name}</TableCell>
                <TableCell>{stay.city?.name || 'N/A'}</TableCell>
                <TableCell>{stay.stayType?.name || 'N/A'}</TableCell>
                <TableCell className="text-center">{stay.units?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/host/stays/${stay.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/host/stays/${stay.id}/edit`)}>
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(stay)}>
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
            <AlertDialogTitle>Delete Stay</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{stayToDelete?.name}"? This will also delete all units associated with
              this stay. This action cannot be undone.
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
