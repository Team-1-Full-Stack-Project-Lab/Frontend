import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

type Stay = {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  imageUrl: string | null
}

export function StayCard({ stay }: { stay: Stay }) {

  return (
    <Card className="overflow-hidden transition-all p-0 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={stay.imageUrl || "/placeholder.svg"}
          alt={stay.name}
          className="size-full object-cover transition-transform hover:scale-105"
        />
      </div>

      <div className="mb-2 flex items-start justify-between gap-2 p-3">
        <div className="flex-1">
          <h3
            className="font-semibold text-foreground text-lg leading-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {stay.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="size-3.5" />
            <span>{stay.address}</span>
          </div>
        </div>


        <div className="flex items-center justify-between gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">View Details</Button>
        </div>
      </div>
    </Card>
  )
}
