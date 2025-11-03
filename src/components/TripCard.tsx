import { format, parseISO } from 'date-fns'
import { Calendar, MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Trip } from '@/shared/types'
import { Button } from './ui/button'

interface TripCardProps {
  trip: Trip
  onEditTrip: (trip: Trip) => void
  onDeleteTrip: (trip: Trip) => void
}

export function TripCard({ trip, onEditTrip, onDeleteTrip }: TripCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-56 bg-gradient-to-b from-blue-500 to-blue-950 p-0 cursor-pointer">
      <CardHeader className="p-2 flex flex-row justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEditTrip(trip)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDeleteTrip(trip)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 mt-auto">
        <h3 className="text-white font-bold text-xl mb-2">{trip.name}</h3>

        <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
          <MapPin className="h-4 w-4" />
          <span>{trip.destination}</span>
        </div>

        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {format(parseISO(trip.startDate), 'MMM d')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
