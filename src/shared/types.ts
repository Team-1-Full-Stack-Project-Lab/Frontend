export interface UserData {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface Stay {
  id: string
  title: string
  location: string
  pricePerNight: string
  images?: string[]
}

export interface Itinerary {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  stays: Stay[]
  createdAt: string
}
