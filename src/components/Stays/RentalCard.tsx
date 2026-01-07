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
      <Card className="w-full max-w-full flex flex-col sm:flex-row items-stretch gap-0 p-0 rounded-lg h-auto sm:h-51">
        <div className="w-full sm:w-2/5 shrink-0 h-48 sm:h-full relative overflow-hidden rounded-t-lg sm:rounded-t-none sm:rounded-l-lg">
          {stay.images && stay.images.length > 0 ? (
            <ImageCarousel images={stay.images} altText={stay.name} className="h-full" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No image</p>
            </div>
          )}
        </div>

        <div className="flex-1 px-4 sm:px-6 py-3 h-full flex flex-col justify-between min-w-0">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
            <div className="w-full min-w-0 flex-1">
              <div className="text-sm text-muted-foreground mb-1 truncate">{stay.stayType?.name || 'Stay'}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2 break-words">
                <a href="#" className="hover:underline">
                  {stay.name}
                </a>
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {cityName}, {countryName}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 break-all">{stay.address}</p>
            </div>

            <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
              {stay.units && stay.units.length > 0 && (
                <>
                  <div className="text-sm text-muted-foreground mb-1">From</div>
                  <div className="text-lg font-semibold whitespace-nowrap">${lowestPrice.toFixed(2)}/night</div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {stay.units.length} units available
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {stay.services && stay.services.length > 0 && (
                <div className="text-sm whitespace-nowrap">{stay.services.length} services</div>
              )}
            </div>

            <Button onClick={() => setIsDialogOpen(true)} variant="link" className="p-0 sm:p-2">
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
