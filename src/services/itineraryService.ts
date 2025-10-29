import type { Itinerary, Stay } from '@/shared/types'

const STORAGE_KEY = 'itineraries'

// Placeholder service using localStorage
// This will be replaced with actual API calls when backend is ready

export interface CreateItineraryRequest {
  name: string
  destination: string
  startDate: string
  endDate: string
  stay?: Stay // Optional stay to add immediately
}

export function getItineraries(): Itinerary[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored) as Itinerary[]
  } catch {
    return []
  }
}

export function createItinerary(data: CreateItineraryRequest): Itinerary {
  const newItinerary: Itinerary = {
    id: crypto.randomUUID(),
    name: data.name,
    destination: data.destination,
    startDate: data.startDate,
    endDate: data.endDate,
    stays: data.stay ? [data.stay] : [],
    createdAt: new Date().toISOString(),
  }

  const itineraries = getItineraries()
  itineraries.push(newItinerary)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itineraries))

  return newItinerary
}

export function addStayToItinerary(itineraryId: string, stay: Stay): Itinerary | null {
  const itineraries = getItineraries()
  const itinerary = itineraries.find(i => i.id === itineraryId)
  
  if (!itinerary) return null

  // Check if stay already exists
  if (!itinerary.stays.find(s => s.id === stay.id)) {
    itinerary.stays.push(stay)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itineraries))
  }

  return itinerary
}

export function deleteItinerary(id: string): boolean {
  const itineraries = getItineraries()
  const filtered = itineraries.filter(i => i.id !== id)
  
  if (filtered.length === itineraries.length) return false
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

export function getItineraryById(id: string): Itinerary | null {
  const itineraries = getItineraries()
  return itineraries.find(i => i.id === id) || null
}
