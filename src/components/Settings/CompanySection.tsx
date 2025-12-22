import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Building2, PenLine, PlusCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
import { useAuth } from '@/hooks/useAuth'
import { useServices } from '@/hooks/useServices'
import CompanyFormDialog, { type CompanyFormValues } from '@/components/Settings/CompanyFormDialog'
import { ApiException } from '@/utils/exceptions'
import type { Company, ValidationError } from '@/types'

export default function CompanySection() {
  const { user, refreshUser } = useAuth()
  const { companyService } = useServices()
  const company = user?.company ?? null

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [formValues, setFormValues] = useState<CompanyFormValues>({
    name: '',
    email: '',
    phone: '',
    description: '',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<ValidationError>({})
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const formattedCreatedAt = useMemo(() => {
    if (!company) return ''
    return new Date(company.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [company])

  const formattedUpdatedAt = useMemo(() => {
    if (!company) return ''
    return new Date(company.updatedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [company])

  const openCreateDialog = () => {
    setFormMode('create')
    setFormValues({
      name: '',
      email: '',
      phone: '',
      description: '',
    })
    setFormErrors({})
    setFormOpen(true)
  }

  const openEditDialog = (data: Company) => {
    setFormMode('edit')
    setFormValues({
      name: data.name,
      email: data.email,
      phone: data.phone ?? '',
      description: data.description ?? '',
    })
    setFormErrors({})
    setFormOpen(true)
  }

  const handleFormChange = (field: keyof CompanyFormValues, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }))
    setFormErrors(prev => {
      if (!prev[field as string]?.length) return prev
      const { [field as string]: _removed, ...rest } = prev
      return rest
    })
  }

  const handleFormSubmit = async () => {
    try {
      setFormLoading(true)
      setFormErrors({})

      const payload = {
        name: formValues.name?.trim(),
        email: formValues.email?.trim(),
        phone: formValues.phone?.trim(),
        description: formValues.description?.trim(),
      }

      if (formMode === 'create') {
        await companyService.createCompany(payload)
        toast.success('Company created successfully')
      } else if (company) {
        await companyService.updateCompany(company.id, payload)
        toast.success('Company updated successfully')
      }

      setFormOpen(false)
      await refreshUser()
    } catch (error) {
      if (error instanceof ApiException && error.status === 400 && error.apiError.errors) {
        setFormErrors(error.apiError.errors)
        return
      }

      console.error('Error saving company', error)
      toast.error('Something went wrong, please try again')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setFormErrors({})
    }
  }

  const handleDeleteCompany = async () => {
    if (!company) return

    try {
      setDeleteLoading(true)
      await companyService.deleteCompany(company.id)
      toast.success('Company deleted successfully')
      setDeleteOpen(false)
      await refreshUser()
    } catch (error) {
      console.error('Error deleting company', error)
      toast.error('Unable to delete company right now')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Company</h3>
        <p className="text-sm text-muted-foreground">
          Create a company profile to publish your stays without losing access to traveler tools.
        </p>
      </div>
      <Separator />

      {company ? (
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{company.name}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => openEditDialog(company)}>
                <PenLine className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">Business email</p>
              <p className="text-muted-foreground">{company.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Phone</p>
              <p className="text-muted-foreground">{company.phone || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-semibold">Description</p>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {company.description || 'Let guests know what makes your stays special.'}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span>Created {formattedCreatedAt}</span>
            <span>Last updated {formattedUpdatedAt}</span>
          </CardFooter>
        </Card>
      ) : (
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <div className="rounded-full bg-muted p-4">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-semibold">Host as a company</h4>
            <p className="text-sm text-muted-foreground max-w-md">
              Launch your business profile to list multiple properties, manage payouts, and keep your traveler tools in
              one place.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create company
          </Button>
        </Card>
      )}

      <CompanyFormDialog
        open={formOpen}
        onOpenChange={handleDialogOpenChange}
        mode={formMode}
        loading={formLoading}
        values={formValues}
        errors={formErrors}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete company</AlertDialogTitle>
            <AlertDialogDescription>
              This action removes your company profile and detaches all existing stays. You can create a new company
              anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? 'Deleting...' : 'Delete company'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
