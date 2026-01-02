import type { City, Country, State, Region } from '@/types/domain'
import type { CityResponse, CountryResponse, StateResponse, RegionResponse } from '@/types/dtos/locations'
import type { CityGraphQL } from '@/types/dtos/locations'

export function countryFromResponse(dto: CountryResponse): Country {
  return {
    id: dto.id,
    name: dto.name,
    iso2Code: dto.iso2Code,
    iso3Code: dto.iso3Code,
    phoneCode: dto.phoneCode,
    currencyCode: dto.currencyCode,
    currencySymbol: dto.currencySymbol,
  }
}

export function stateFromResponse(dto: StateResponse): State {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    latitude: dto.latitude,
    longitude: dto.longitude,
  }
}

export function cityFromResponse(dto: CityResponse): City {
  return {
    id: dto.id,
    name: dto.name,
    nameAscii: dto.nameAscii,
    country: dto.country ? countryFromResponse(dto.country) : undefined,
    state: dto.state ? stateFromResponse(dto.state) : undefined,
    latitude: dto.latitude,
    longitude: dto.longitude,
    timezone: dto.timezone,
    googlePlaceId: dto.googlePlaceId,
    population: dto.population,
    isCapital: dto.isCapital,
    isFeatured: dto.isFeatured,
  }
}

export function cityFromGraphQL(dto: CityGraphQL): City {
  return {
    id: parseInt(dto.id),
    name: dto.name,
    nameAscii: dto.nameAscii,
    country: dto.country
      ? {
          id: parseInt(dto.country.id),
          name: dto.country.name,
          iso2Code: dto.country.iso2Code,
          iso3Code: dto.country.iso3Code,
          phoneCode: dto.country.phoneCode,
          currencyCode: dto.country.currencyCode,
          currencySymbol: dto.country.currencySymbol,
        }
      : undefined,
    state: dto.state
      ? {
          id: parseInt(dto.state.id),
          name: dto.state.name,
          code: dto.state.code,
          latitude: dto.state.latitude,
          longitude: dto.state.longitude,
        }
      : undefined,
    latitude: dto.latitude,
    longitude: dto.longitude,
    timezone: dto.timezone,
    googlePlaceId: dto.googlePlaceId,
    population: dto.population,
    isCapital: dto.isCapital,
    isFeatured: dto.isFeatured,
  }
}

export function regionFromResponse(dto: RegionResponse): Region {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    countries: dto.countries?.map(countryFromResponse),
  }
}
