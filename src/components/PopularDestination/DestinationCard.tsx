import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { useState } from "react"
import { ImageCarousel } from '@/components/ImageCarousel'
import type { Stay } from '@/types'
import { StayDetailsDialog } from "../Stays/StayDetailsDialog"
import { useServices } from '@/hooks/useServices'

interface DestinationCardProps {
  stay: Stay
}

export function DestinationCard({ stay }: DestinationCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stayDetails, setStayDetails] = useState<Stay | null>(null)
  const [, setIsLoading] = useState(false)
  const { stayService } = useServices()

  const handleViewDetails = async () => {
    if (stayDetails) {
      setIsDialogOpen(true)
      return
    }
    setIsLoading(true)
    try {
      const fetchedStay = await stayService.getStayById(stay.id)
      setStayDetails(fetchedStay)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error loading stay details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const lowestPrice = stay.units && stay.units.length > 0
    ? Math.min(...stay.units.map(u => u.pricePerNight))
    : 0

  const cityName = stay.city?.name || 'Unknown'
  const countryName = stay.city?.country?.name || ''

  return (
    <>
      <Card className="overflow-hidden transition-all p-0 hover:shadow-lg">
        <div className="relative h-60 w-full overflow-hidden">
          {stay.images && stay.images.length > 0 ? (
            <ImageCarousel
              images={stay.images}
              altText={stay.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No image</p>
            </div>
          )}
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3
              className="font-semibold text-foreground text-lg leading-tight mb-2"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {stay.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {cityName}{countryName && `, ${countryName}`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
              {stay.address}
            </p>
            {stay.units && stay.units.length > 0 && (
              <>
                <div className="text-sm text-muted-foreground mb-1">From</div>
                <div className="text-2xl font-bold text-primary">${lowestPrice.toFixed(2)}/night</div>
                <div className="text-xs text-muted-foreground">
                  {stay.units.length} {stay.units.length === 1 ? 'unit' : 'units'} available
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end mt-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>

      {stayDetails && (
        <StayDetailsDialog
          stay={stayDetails}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  )
}