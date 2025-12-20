import type { StayUnitGraphQL } from '../stays'

export interface TripGraphQL {
  id: string
  name: string
  city: {
    id: string
    name: string
  }
  country: {
    id: string
    name: string
  }
  startDate: string
  endDate: string
}

export interface TripStayUnitGraphQL {
  trip: TripGraphQL | null
  stayUnit: StayUnitGraphQL | null
  startDate: string
  endDate: string
}

export interface TripStayUnitsListGraphQL {
  tripStayUnits: TripStayUnitGraphQL[]
}
