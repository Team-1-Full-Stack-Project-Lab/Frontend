export interface ValidationError {
  [field: string]: string[]
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  errors?: ValidationError
  path: string
}

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

export interface Trip {
  id: number
  name: string
  cityId: number
  destination: string
  startDate: string
  endDate: string
}

export interface Country {
  id: number
  name: string
  iso2Code: string
  iso3Code: string
  phoneCode: string
  currencyCode: string
  currencySymbol: string
}

export interface State {
  id: number
  name: string
  code: string
  latitude: number
  longitude: number
}

export interface City {
  id: number
  name: string
  nameAscii: string
  country?: Country
  state?: State
  latitude: number
  longitude: number
  timezone: string
  googlePlaceId?: string
  population: number
  isCapital: boolean
  isFeatured: boolean
}
