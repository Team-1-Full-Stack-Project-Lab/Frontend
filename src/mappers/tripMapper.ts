import type { Trip, TripStayUnit } from '@/types/domain'
import type { TripResponse, TripStayUnitResponse } from '@/types/dtos/trips'
import type { TripGraphQL, TripStayUnitGraphQL } from '@/types/dtos/trips'
import { cityFromResponse } from './locationMapper'
import { stayUnitFromResponse, stayUnitFromGraphQL } from './stayMapper'

function calculateDuration(startDate: Date, endDate: Date): number {
  const diff = endDate.getTime() - startDate.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function tripFromResponse(dto: TripResponse): Trip {
  const startDate = new Date(dto.startDate)
  const endDate = new Date(dto.endDate)

  return {
    id: dto.id,
    name: dto.name,
    city: dto.city ? cityFromResponse(dto.city) : undefined,
    country: dto.country
      ? {
          id: dto.country.id,
          name: dto.country.name,
          iso2Code: dto.country.iso2Code,
          iso3Code: dto.country.iso3Code,
          phoneCode: dto.country.phoneCode,
          currencyCode: dto.country.currencyCode,
          currencySymbol: dto.country.currencySymbol,
        }
      : undefined,
    startDate,
    endDate,
    destination: `${dto.city?.name || 'Unknown'}, ${dto.country?.name || 'Unknown'}`,
    durationDays: calculateDuration(startDate, endDate),
  }
}

export function tripFromGraphQL(dto: TripGraphQL): Trip {
  const startDate = new Date(dto.startDate)
  const endDate = new Date(dto.endDate)

  return {
    id: parseInt(dto.id),
    name: dto.name,
    city: {
      id: parseInt(dto.city.id),
      name: dto.city.name,
      nameAscii: dto.city.name,
      latitude: 0,
      longitude: 0,
      isCapital: false,
      isFeatured: false,
    },
    country: {
      id: parseInt(dto.country.id),
      name: dto.country.name,
      iso2Code: '',
    },
    startDate,
    endDate,
    destination: `${dto.city.name}, ${dto.country.name}`,
    durationDays: calculateDuration(startDate, endDate),
  }
}

export function tripStayUnitFromResponse(dto: TripStayUnitResponse): TripStayUnit {
  const startDate = new Date(dto.startDate)
  const endDate = new Date(dto.endDate)

  return {
    trip: tripFromResponse(dto.trip),
    stayUnit: stayUnitFromResponse(dto.stayUnit),
    startDate,
    endDate,
    durationDays: calculateDuration(startDate, endDate),
  }
}

export function tripStayUnitFromGraphQL(dto: TripStayUnitGraphQL): TripStayUnit | null {
  if (!dto.trip || !dto.stayUnit) return null

  const startDate = new Date(dto.startDate)
  const endDate = new Date(dto.endDate)

  return {
    trip: tripFromGraphQL(dto.trip),
    stayUnit: stayUnitFromGraphQL(dto.stayUnit),
    startDate,
    endDate,
    durationDays: calculateDuration(startDate, endDate),
  }
}

export function dateToLocalString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
