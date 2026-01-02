import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useState } from "react"
import type { HotelData, Stay } from "@/types"
import { StayDetailsDialog } from "../Stays/StayDetailsDialog"
import { useServices } from '@/hooks/useServices'

export function StayCard({ hotel }: { hotel: HotelData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stayDetails, setStayDetails] = useState<Stay | null>(null)
  const [, setIsLoading] = useState(false)
  const imageUrl = hotel.imageUrl || "/placeholder.svg"
  const { stayService } = useServices()

  const handleViewDetails = async () => {
    if (stayDetails) {
      setIsDialogOpen(true)
      return
    }
    setIsLoading(true)
    try {
      const fetchedStay = await stayService.getStayById(hotel.id)
      setStayDetails(fetchedStay)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error loading stay details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden transition-all p-0 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={hotel.name}
            className="size-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder. svg"
            }}
          />
        </div>

        <div className="mb-2 flex items-start justify-between gap-2 p-3">
          <div className="flex-1">
            <h3
              className="font-semibold text-foreground text-lg leading-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {hotel.name}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="size-3.5" />
              <span>{hotel.address}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleViewDetails}
            >View Details</Button>
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
