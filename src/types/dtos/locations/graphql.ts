export interface CityGraphQL {
  id: string
  name: string
  nameAscii: string
  latitude: number
  longitude: number
  timezone: string
  googlePlaceId?: string
  population: number
  isCapital: boolean
  isFeatured: boolean
  country?: {
    id: string
    name: string
    iso2Code: string
    iso3Code: string
    phoneCode?: string
    currencyCode?: string
    currencySymbol?: string
  }
  state?: {
    id: string
    name: string
    code: string
    latitude?: number
    longitude?: number
  }
}
