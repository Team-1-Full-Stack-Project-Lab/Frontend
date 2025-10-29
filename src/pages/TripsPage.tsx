import { CardComponent } from '@/components/CardComponent'
import { CreateItineraryDialog } from '@/components/CreateItineraryDialog'
import { useState, useEffect } from 'react'
import { getItineraries } from '@/services/itineraryService'
import type { Itinerary } from '@/shared/types'
import { format } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'

export default function TripsPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const loadItineraries = () => {
    const loaded = getItineraries()
    setItineraries(loaded)
  }

  useEffect(() => {
    loadItineraries()
  }, [])

  const handleItineraryCreated = () => {
    loadItineraries()
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  return (
    <>
      <title>Trips</title>

      <div className="w-full max-w-6xl mx-auto my-6 px-4">
        {showSuccessMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="font-medium">Success!</p>
            <p className="text-sm">Your itinerary has been created.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
          <h1 className="text-3xl font-bold">Trip Organizer</h1>
          <CreateItineraryDialog onSuccess={handleItineraryCreated} />
        </div>

        {/* Itineraries Section */}
        {itineraries.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">My Itineraries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 h-56 flex flex-col justify-end shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="bg-gradient-to-t from-gray-900/80 to-transparent p-4">
                    <h3 className="text-white font-bold text-xl mb-2">{itinerary.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                      <MapPin className="h-4 w-4" />
                      <span>{itinerary.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(itinerary.startDate), 'MMM d')} - {format(new Date(itinerary.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">
                      {itinerary.stays.length} {itinerary.stays.length === 1 ? 'stay' : 'stays'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CardComponent />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border border-gray-200 rounded-2xl p-4 hover:shadow-sm mt-8">
          <h2 className="font-semibold text-gray-900">Find your booking</h2>
          <p className="text-sm text-gray-500">Use your itinerary number to look it up</p>
        </div>
      </div>
    </>
  )
}
