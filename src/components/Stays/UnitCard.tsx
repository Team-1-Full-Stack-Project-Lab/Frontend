import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bed, Users, Plus } from 'lucide-react'
import { AddUnitToTripPopover } from '@/components/Stays/AddUnitToTripPopover'
import type { StayUnit } from '@/types'
import type { DateRange } from 'react-day-picker'
import { useAuth } from '@/hooks/useAuth'

type Props = {
  unit: StayUnit
  onAddedToTrip?: () => void
  initialCityId?: number
  initialDateRange?: DateRange
}

export function UnitCard({ unit, onAddedToTrip, initialCityId, initialDateRange }: Props) {
  const { isAuthenticated } = useAuth()

  return (
    <Card className="p-4 flex flex-col">
      <h4 className="font-semibold mb-3">{unit.roomType}</h4>

      <div className="flex-1 space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bed className="h-4 w-4 shrink-0" />
          <span>
            {unit.numberOfBeds} {unit.numberOfBeds === 1 ? 'bed' : 'beds'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            Up to {unit.capacity} {unit.capacity === 1 ? 'guest' : 'guests'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Unit: {unit.stayNumber}</p>
      </div>

      <div className="mt-auto space-y-3">
        <div className="text-center py-2 border-t">
          <div className="text-2xl font-bold text-primary">${unit.pricePerNight.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">per night</div>
        </div>
        {isAuthenticated ? (
          <AddUnitToTripPopover
            unit={unit}
            onSaved={onAddedToTrip}
            initialCityId={initialCityId}
            initialDateRange={initialDateRange}
          >
            <Button size="sm" variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add to Trip
            </Button>
          </AddUnitToTripPopover>
        ) : (
          <Button size="sm" variant="outline" className="w-full gap-2" disabled>
            <Plus className="h-4 w-4" />
            Add to Trip
          </Button>
        )}
      </div>
    </Card>
  )
}
