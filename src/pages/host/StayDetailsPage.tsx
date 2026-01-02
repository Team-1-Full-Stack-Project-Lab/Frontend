import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, PenLine, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UnitsTable } from '@/components/Host/UnitsTable'
import { UnitFormDialog, type UnitFormValues } from '@/components/Host/UnitFormDialog'
import { ImageCarousel } from '@/components/ImageCarousel'
import { FullscreenImageCarousel } from '@/components/FullscreenImageCarousel'
import { LucideIcon } from '@/components/LucideIcon'
import { useServices } from '@/hooks/useServices'
import { getToken } from '@/services/rest/authService'
import { ApiException } from '@/utils/exceptions'
import type { Stay, StayUnit, ValidationError } from '@/types'

export default function StayDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { stayService } = useServices()

  const [stay, setStay] = useState<Stay | null>(null)
  const [loading, setLoading] = useState(true)
  const [unitDialogOpen, setUnitDialogOpen] = useState(false)
  const [unitDialogMode, setUnitDialogMode] = useState<'create' | 'edit'>('create')
  const [unitDialogLoading, setUnitDialogLoading] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<StayUnit | null>(null)
  const [unitErrors, setUnitErrors] = useState<ValidationError>({})
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [fullscreenStartIndex, setFullscreenStartIndex] = useState(0)

  const loadStay = async () => {
    if (!id) return

    try {
      setLoading(true)
      const result = await stayService.getStayById(parseInt(id))
      setStay(result)
    } catch (error) {
      console.error('Error loading stay:', error)
      toast.error('Failed to load stay details')
      navigate('/host/stays')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadStay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAddUnit = () => {
    setUnitDialogMode('create')
    setSelectedUnit(null)
    setUnitErrors({})
    setUnitDialogOpen(true)
  }

  const handleEditUnit = (unit: StayUnit) => {
    setUnitDialogMode('edit')
    setSelectedUnit(unit)
    setUnitErrors({})
    setUnitDialogOpen(true)
  }

  const handleImageClick = (index: number) => {
    setFullscreenStartIndex(index)
    setIsFullscreenOpen(true)
  }

  const handleUnitSubmit = async (values: UnitFormValues) => {
    if (!stay) return

    try {
      setUnitDialogLoading(true)
      setUnitErrors({})
      const token = getToken()
      if (!token) throw new Error('No token found')

      if (unitDialogMode === 'create') {
        await stayService.createStayUnit(
          {
            ...values,
            stayId: stay.id,
          },
          token
        )
        toast.success('Unit added successfully')
      } else if (selectedUnit) {
        await stayService.updateStayUnit(selectedUnit.id, values, token)
        toast.success('Unit updated successfully')
      }

      setUnitDialogOpen(false)
      await loadStay()
    } catch (error) {
      if (error instanceof ApiException && error.status === 400 && error.apiError.errors) {
        setUnitErrors(error.apiError.errors)
        return
      }
      console.error('Error saving unit:', error)
      toast.error('Failed to save unit')
    } finally {
      setUnitDialogLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <title>Stay Details</title>
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!stay) {
    return (
      <div className="space-y-6">
        <title>Stay Not Found</title>
        <div>Stay not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <title>{stay.name} - Details</title>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/host/stays')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h3 className="text-lg font-medium">{stay.name}</h3>
          <p className="text-sm text-muted-foreground">
            {stay.city?.name}
            {stay.city?.country ? `, ${stay.city.country.name}` : ''}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/host/stays/${stay.id}/edit`)}>
          <PenLine className="mr-2 h-4 w-4" /> Edit Stay
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {stay.images && stay.images.length > 0 && (
              <div className="relative w-full lg:w-1/2 h-64 lg:h-96 rounded-lg overflow-hidden shrink-0">
                <ImageCarousel
                  images={stay.images}
                  altText={stay.name}
                  className="h-full"
                  onImageClick={handleImageClick}
                />
              </div>
            )}

            <div className="flex-1 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground">{stay.description || 'No description provided'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Type</p>
                    <p className="text-muted-foreground">{stay.stayType?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Address</p>
                    <p className="text-muted-foreground">{stay.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Coordinates</p>
                    <p className="text-muted-foreground">
                      {stay.latitude.toFixed(4)}, {stay.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Total Units</p>
                    <p className="text-muted-foreground">{stay.units?.length || 0}</p>
                  </div>
                </div>
              </div>

              {stay.services && stay.services.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Amenities & Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {stay.services.map(service => (
                      <span
                        key={service.id}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-2"
                      >
                        <LucideIcon name={service.icon} className="h-4 w-4" />
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Units</CardTitle>
              <CardDescription>Manage the rooms or units available in this property</CardDescription>
            </div>
            <Button onClick={handleAddUnit}>
              <Plus className="mr-2 h-4 w-4" /> Add Unit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UnitsTable units={stay.units || []} onEdit={handleEditUnit} onDelete={loadStay} />
        </CardContent>
      </Card>

      <UnitFormDialog
        open={unitDialogOpen}
        mode={unitDialogMode}
        loading={unitDialogLoading}
        unit={selectedUnit}
        errors={unitErrors}
        onOpenChange={setUnitDialogOpen}
        onSubmit={handleUnitSubmit}
      />

      {stay.images && stay.images.length > 0 && (
        <FullscreenImageCarousel
          images={stay.images}
          altText={stay.name}
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          initialIndex={fullscreenStartIndex}
        />
      )}
    </div>
  )
}
