import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Eye } from 'lucide-react'

interface DestinationCardProps {
  image: string
  title: string
  location: string
  rating: number
  reviews: number
  price: number
}

export function DestinationCard({ image, title, location, rating, reviews, price }: DestinationCardProps) {
  return (
    <Card className="group overflow-hidden transition-all p-0 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-balance text-lg font-semibold leading-tight">{title}</h3>
          <div className="flex shrink-0 items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">${price}</span>
          <span className="text-sm text-muted-foreground">per person</span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{reviews.toLocaleString()} reviews</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-transparent" variant="outline">
          <Eye /> View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
