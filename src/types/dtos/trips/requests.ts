export interface CreateTripRequest {
  name?: string
  cityId?: number
  startDate?: string
  endDate?: string
}

export interface UpdateTripRequest {
  name?: string
  cityId?: number
  startDate?: string
  endDate?: string
}

export interface AddStayUnitRequest {
  stayUnitId: number
  startDate: string
  endDate: string
}
