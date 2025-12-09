import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin } from 'lucide-react'
import { ImageCarousel } from '@/components/ImageCarousel'
import { FullscreenImageCarousel } from '@/components/FullscreenImageCarousel'
import { LucideIcon } from '@/components/LucideIcon'
import { UnitCard } from './UnitCard'
import type { Stay } from '@/types'
import { useState } from 'react'
import { useTripsDrawer } from '@/hooks/useTripsDrawer'

type Props = {
  stay: Stay
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function StayDetailsDialog({ stay, isOpen, onOpenChange }: Props) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [fullscreenStartIndex, setFullscreenStartIndex] = useState(0)
  const { openDrawer } = useTripsDrawer()

  const handleUnitAddedToTrip = () => {
    onOpenChange(false)

    setTimeout(() => {
      openDrawer()
    }, 300)
  }

  const cityName = stay.city?.name || 'Unknown'
  const countryName = stay.city?.country?.name || ''

  const handleImageClick = (index: number) => {
    setFullscreenStartIndex(index)
    setIsFullscreenOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{stay.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {cityName}, {countryName} • {stay.address}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
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
                  <p className="text-muted-foreground">{stay.description}</p>
                </div>

                {stay.stayType && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Property Type</h3>
                    <p className="text-muted-foreground">{stay.stayType.name}</p>
                  </div>
                )}

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

            {stay.units && stay.units.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Available Units ({stay.units.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {stay.units.map(unit => (
                    <UnitCard key={unit.id} unit={unit} onAddedToTrip={handleUnitAddedToTrip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {stay.images && stay.images.length > 0 && (
        <FullscreenImageCarousel
          images={stay.images}
          altText={stay.name}
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          initialIndex={fullscreenStartIndex}
        />
      )}
    </>
  )
}
