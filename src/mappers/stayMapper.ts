import type { Stay, StayUnit, StayType, StayImage } from '@/types/domain'
import type { StayResponse, StayUnitResponse, StayTypeResponse, StayImageResponse } from '@/types/dtos/stays'
import type { StayGraphQL, StayUnitGraphQL, StayTypeGraphQL, StayImageGraphQL } from '@/types/dtos/stays'
import { cityFromResponse, cityFromGraphQL } from './locationMapper'
import { serviceFromResponse, serviceFromGraphQL } from './serviceMapper'
import { companyFromResponse, companyFromGraphQL } from './companyMapper'

export function stayTypeFromResponse(dto: StayTypeResponse): StayType {
  return {
    id: dto.id,
    name: dto.name,
  }
}

export function stayTypeFromGraphQL(dto: StayTypeGraphQL): StayType {
  return {
    id: parseInt(dto.id),
    name: dto.name,
  }
}

export function stayImageFromResponse(dto: StayImageResponse): StayImage {
  return {
    id: dto.id,
    link: dto.link,
    stayId: dto.stayId,
  }
}

export function stayImageFromGraphQL(dto: StayImageGraphQL): StayImage {
  return {
    id: parseInt(dto.id),
    link: dto.link,
    stayId: dto.stayId ? parseInt(dto.stayId) : undefined,
  }
}

export function stayUnitFromResponse(dto: StayUnitResponse, includeStay = false): StayUnit {
  return {
    id: dto.id,
    stayNumber: dto.stayNumber,
    numberOfBeds: dto.numberOfBeds,
    capacity: dto.capacity,
    pricePerNight: dto.pricePerNight,
    roomType: dto.roomType,
    stay: includeStay && dto.stay ? stayFromResponse(dto.stay, false) : undefined,
  }
}

export function stayUnitFromGraphQL(dto: StayUnitGraphQL, includeStay = false): StayUnit {
  return {
    id: parseInt(dto.id),
    stayNumber: dto.stayNumber,
    numberOfBeds: dto.numberOfBeds,
    capacity: dto.capacity,
    pricePerNight: dto.pricePerNight,
    roomType: dto.roomType,
    stay: includeStay && dto.stay ? stayFromGraphQL(dto.stay, false) : undefined,
  }
}

export function stayFromResponse(dto: StayResponse, includeUnits = true): Stay {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    latitude: dto.latitude,
    longitude: dto.longitude,
    description: dto.description,
    city: dto.city ? cityFromResponse(dto.city) : undefined,
    stayType: dto.stayType ? stayTypeFromResponse(dto.stayType) : undefined,
    services: dto.services?.map(serviceFromResponse) || [],
    units: includeUnits ? dto.units?.map(u => stayUnitFromResponse(u, false)) || [] : [],
    images: dto.images?.map(stayImageFromResponse) || [],
    company: dto.company ? companyFromResponse(dto.company) : undefined,
  }
}

export function stayFromGraphQL(dto: StayGraphQL, includeUnits = true): Stay {
  return {
    id: parseInt(dto.id),
    name: dto.name,
    address: dto.address,
    latitude: dto.latitude,
    longitude: dto.longitude,
    description: dto.description,
    city: dto.city ? cityFromGraphQL(dto.city) : undefined,
    stayType: dto.stayType ? stayTypeFromGraphQL(dto.stayType) : undefined,
    services: dto.services?.map(serviceFromGraphQL) || [],
    units: includeUnits ? dto.units?.map(u => stayUnitFromGraphQL(u, false)) || [] : [],
    images: dto.images?.map(stayImageFromGraphQL) || [],
    company: dto.company ? companyFromGraphQL(dto.company) : undefined,
  }
}
