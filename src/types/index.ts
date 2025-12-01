export * from './common'
export * from './domain'

// Re-export DTOs with specific exports to avoid conflicts
// Auth DTOs
export type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  AuthResponse,
  DeleteUserResponse,
  UserResponse,
  UserGraphQL,
} from './dtos/auth'

// Trip DTOs
export type {
  CreateTripRequest,
  UpdateTripRequest,
  AddStayUnitRequest,
  TripResponse,
  TripsResponse,
  TripStayUnitResponse,
  TripStayUnitsResponse,
  TripGraphQL,
  TripStayUnitGraphQL,
  TripStayUnitsListGraphQL,
} from './dtos/trips'

// Stay DTOs
export type {
  StayTypeResponse,
  ServiceResponse,
  StayUnitResponse,
  StayResponse,
  StayImageResponse,
  StayTypeGraphQL,
  ServiceGraphQL,
  StayUnitGraphQL,
  StayImageGraphQL,
  StayGraphQL,
} from './dtos/stays'

// Location DTOs
export type {
  RegionResponse,
  CountryResponse,
  StateResponse,
  CityResponse,
  GetCitiesParams,
  CityGraphQL,
} from './dtos/locations'
