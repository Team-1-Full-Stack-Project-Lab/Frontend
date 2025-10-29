import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CreateItineraryDialog } from '@/components/CreateItineraryDialog'
import { getItineraries, addStayToItinerary } from '@/services/itineraryService'
import type { Stay } from '@/shared/types'
import { Plus, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SaveToItineraryPopoverProps {
  stay: Stay
  children: React.ReactNode
  onSaved?: () => void
}

export function SaveToItineraryPopover({ stay, children, onSaved }: SaveToItineraryPopoverProps) {
  const [itineraries, setItineraries] = useState(getItineraries())
  const [savedToIds, setSavedToIds] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      const currentItineraries = getItineraries()
      setItineraries(currentItineraries)
      
      // Check which itineraries already have this stay
      const saved = new Set<string>()
      currentItineraries.forEach(itinerary => {
        if (itinerary.stays.some(s => s.id === stay.id)) {
          saved.add(itinerary.id)
        }
      })
      setSavedToIds(saved)
    }
  }, [open, stay.id])

  const handleAddToItinerary = (itineraryId: string) => {
    const result = addStayToItinerary(itineraryId, stay)
    if (result) {
      setSavedToIds(prev => new Set([...prev, itineraryId]))
      onSaved?.()
    }
  }

  const handleNewItineraryCreated = () => {
    const updated = getItineraries()
    setItineraries(updated)
    onSaved?.()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0" 
        align="end"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Save to itinerary</h3>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {itineraries.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                You don't have any itineraries yet
              </p>
              <CreateItineraryDialog
                prefillData={{ destination: stay.location, stay }}
                onSuccess={handleNewItineraryCreated}
                trigger={
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Create your first itinerary
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <div className="py-1">
                {itineraries.map((itinerary) => {
                  const isSaved = savedToIds.has(itinerary.id)
                  return (
                    <button
                      key={itinerary.id}
                      onClick={() => !isSaved && handleAddToItinerary(itinerary.id)}
                      disabled={isSaved}
                      className="w-full px-4 py-2.5 hover:bg-gray-50 text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{itinerary.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {itinerary.destination} · {itinerary.stays.length} {itinerary.stays.length === 1 ? 'stay' : 'stays'}
                        </p>
                      </div>
                      {isSaved && (
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  )
                })}
              </div>
              
              <div className="border-t p-3">
                <CreateItineraryDialog
                  prefillData={{ destination: stay.location, stay }}
                  onSuccess={handleNewItineraryCreated}
                  trigger={
                    <Button variant="ghost" size="sm" className="w-full gap-2 justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Plus className="h-4 w-4" />
                      Create new itinerary
                    </Button>
                  }
                />
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
