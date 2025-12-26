export interface CreateStayRequest {
  name: string
  address: string
  latitude: number
  longitude: number
  description: string
  cityId: number
  stayTypeId: number
  serviceIds?: number[]
  companyId: number
}

export interface CreateStayUnitRequest {
  stayNumber: string
  numberOfBeds: number
  capacity: number
  pricePerNight: number
  roomType: string
  stayId: number
}

export interface UpdateStayRequest {
  name?: string
  address?: string
  latitude?: number
  longitude?: number
  description?: string
  cityId?: number
  stayTypeId?: number
  serviceIds?: number[]
}

export interface UpdateStayUnitRequest {
  stayNumber?: string
  numberOfBeds?: number
  capacity?: number
  pricePerNight?: number
  roomType?: string
}
