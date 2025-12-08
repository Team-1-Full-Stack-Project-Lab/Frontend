import { format, isPast, isFuture, isWithinInterval } from 'date-fns'
import { Calendar, MapPin, MoreVertical, Pencil, Trash2, Hotel, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Trip } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TripCardProps {
  trip: Trip
  onEditTrip: (trip: Trip) => void
  onDeleteTrip: (trip: Trip) => void
  onClick?: (trip: Trip) => void
  staysCount?: number
}

export function TripCard({ trip, onEditTrip, onDeleteTrip, onClick, staysCount }: TripCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(trip)
    }
  }

  const now = new Date()
  const isOngoing = isWithinInterval(now, { start: trip.startDate, end: trip.endDate })
  const isUpcoming = isFuture(trip.startDate)
  const isPastTrip = isPast(trip.endDate)

  const getStatusBadge = () => {
    if (isOngoing) return { text: 'Ongoing', className: 'bg-green-500 text-white border-green-500' }
    if (isUpcoming) return { text: 'Upcoming', className: 'bg-yellow-400 text-yellow-950 border-yellow-400' }
    if (isPastTrip) return { text: 'Past', className: 'bg-gray-400 text-gray-950 border-gray-400' }
    return null
  }

  const status = getStatusBadge()

  return (
    <Card
      className="flex flex-col overflow-hidden h-56 bg-gradient-to-b from-blue-500 to-blue-950 p-0 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="p-2 flex flex-row justify-between items-start">
        <div className="flex gap-2">{status && <Badge className={status.className}>{status.text}</Badge>}</div>

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
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation()
                onEditTrip(trip)
              }}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation()
                onDeleteTrip(trip)
              }}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 mt-auto space-y-2">
        <h3 className="text-white font-bold text-xl mb-2">{trip.name}</h3>

        <div className="flex items-center gap-2 text-white/90 text-sm">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{trip.destination}</span>
        </div>

        <div className="flex items-center gap-2 text-white/80 text-sm">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>
            {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-3 text-white/80 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {trip.durationDays} {trip.durationDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          {staysCount !== undefined && staysCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Hotel className="h-3.5 w-3.5" />
              <span>
                {staysCount} {staysCount === 1 ? 'stay' : 'stays'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
