import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, MapPin, Bed, Users, Plus } from 'lucide-react'
import { useState } from 'react'
import { AddUnitToTripPopover } from '@/components/AddUnitToTripPopover'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Stay } from '@/types/stays'

type Props = {
  stay: Stay
}

export default function RentalCard({ stay }: Props) {
  const imgs = ['/background.webp'] // Placeholder images
  const [index, setIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const prev = () => setIndex(i => (i - 1 + imgs.length) % imgs.length)
  const next = () => setIndex(i => (i + 1) % imgs.length)

  const lowestPrice = stay.units && stay.units.length > 0 ? Math.min(...stay.units.map(u => u.pricePerNight)) : 0

  const cityName = stay.city?.name || 'Unknown'
  const countryName = stay.city?.country?.name || ''

  const handleSaved = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2500)
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 shadow-lg animate-in fade-in slide-in-from-top-5">
          <p className="font-medium">Saved to trip!</p>
        </div>
      )}
      <Card className="w-full max-w-full flex-row flex items-stretch gap-0 p-0 rounded-lg h-52">
        <div className="w-2/5 shrink-0 h-full relative overflow-hidden">
          <img src={imgs[index]} alt={stay.name} className="h-full w-full object-cover rounded-l-lg" />

          {imgs.length > 1 && (
            <>
              <button
                aria-label="prev"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="next"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <div className="text-sm text-muted-foreground mb-1">{stay.stayType?.name || 'Stay'}</div>
              <h3 className="text-xl font-semibold mb-1">
                <a href="#">{stay.name}</a>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {cityName}, {countryName}
              </p>
              <p className="text-sm text-muted-foreground mb-4">{stay.address}</p>
            </div>

            <div className="text-right">
              {stay.units && stay.units.length > 0 && (
                <>
                  <div className="text-sm text-muted-foreground mb-2">From</div>
                  <div className="text-lg font-semibold">${lowestPrice.toFixed(2)}/night</div>
                  <div className="text-xs text-muted-foreground">{stay.units.length} units available</div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {stay.services && stay.services.length > 0 && (
                <div className="text-sm">{stay.services.length} services</div>
              )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="inline-block text-blue-600 hover:underline cursor-pointer">View details</button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{stay.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4" />
                    {cityName}, {countryName} • {stay.address}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <img src={imgs[index]} alt={stay.name} className="w-full h-full object-cover" />
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
                          <span key={service.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                            {service.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {stay.units && stay.units.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Available Units ({stay.units.length})</h3>
                      <div className="grid gap-4">
                        {stay.units.map(unit => (
                          <Card key={unit.id} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-2">{unit.roomType}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    <span>
                                      {unit.numberOfBeds} {unit.numberOfBeds === 1 ? 'bed' : 'beds'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>
                                      Up to {unit.capacity} {unit.capacity === 1 ? 'guest' : 'guests'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Unit #{unit.stayNumber}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  <div className="text-xl font-bold text-primary">${unit.pricePerNight.toFixed(2)}</div>
                                  <div className="text-xs text-muted-foreground">per night</div>
                                </div>
                                <AddUnitToTripPopover unit={unit} onSaved={handleSaved}>
                                  <Button size="sm" variant="outline" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add to Trip
                                  </Button>
                                </AddUnitToTripPopover>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </>
  )
}
