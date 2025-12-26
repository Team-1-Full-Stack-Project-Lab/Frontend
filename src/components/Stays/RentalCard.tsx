import { Card } from '@/components/ui/card'
import { useState } from 'react'
import type { Stay } from '@/types'
import type { DateRange } from 'react-day-picker'
import { ImageCarousel } from '@/components/ImageCarousel'
import { StayDetailsDialog } from './StayDetailsDialog'
import { Button } from '@/components/ui/button'

type Props = {
  stay: Stay
  initialCityId?: number
  initialDateRange?: DateRange
}

export default function RentalCard({ stay, initialCityId, initialDateRange }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const lowestPrice = stay.units && stay.units.length > 0 ? Math.min(...stay.units.map(u => u.pricePerNight)) : 0

  const cityName = stay.city?.name || 'Unknown'
  const countryName = stay.city?.country?.name || ''

  return (
    <>
      <Card className="w-full max-w-full flex-row flex items-stretch gap-0 p-0 rounded-lg h-51">
        <div className="w-2/5 shrink-0 h-full relative overflow-hidden rounded-l-lg">
          {stay.images && stay.images.length > 0 ? (
            <ImageCarousel images={stay.images} altText={stay.name} className="h-full" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No image</p>
            </div>
          )}
        </div>

        <div className="flex-1 px-6 py-3 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <div className="text-sm text-muted-foreground mb-1">{stay.stayType?.name || 'Stay'}</div>
              <h3 className="text-xl font-semibold mb-1 line-clamp-2">
                <a href="#">{stay.name}</a>
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {cityName}, {countryName}
              </p>
              <p className="text-sm text-muted-foreground truncate">{stay.address}</p>
            </div>

            <div className="text-right shrink-0">
              {stay.units && stay.units.length > 0 && (
                <>
                  <div className="text-sm text-muted-foreground mb-1">From</div>
                  <div className="text-lg font-semibold">${lowestPrice.toFixed(2)}/night</div>
                  <div className="text-xs text-muted-foreground">{stay.units.length} units available</div>
                </>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {stay.services && stay.services.length > 0 && (
                <div className="text-sm">{stay.services.length} services</div>
              )}
            </div>

            <Button onClick={() => setIsDialogOpen(true)} variant="link">
              View details
            </Button>
          </div>
        </div>
      </Card>

      <StayDetailsDialog
        stay={stay}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialCityId={initialCityId}
        initialDateRange={initialDateRange}
      />
    </>
  )
}
