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

// Service DTOs
export type { ServiceResponse, ServiceGraphQL } from './dtos/services'

// Company DTOs
export type { CompanyCreateRequest, CompanyUpdateRequest, CompanyResponse, CompanyGraphQL } from './dtos/companies'

// Stay DTOs
export type {
  GetStaysParams,
  StayTypeResponse,
  StayUnitResponse,
  StayResponse,
  StayImageResponse,
  StayTypeGraphQL,
  StayUnitGraphQL,
  StayImageGraphQL,
  StayGraphQL,
  CreateStayRequest,
  CreateStayUnitRequest,
  UpdateStayRequest,
  UpdateStayUnitRequest,
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

// Agent DTOs
export type {
  ChatRequest,
  ChatResponse,
  HotelData,
  ConversationMessage,
  HotelDataGraphQL,
  ChatResponseGraphQL,
  ConversationMessageGraphQL,
} from './dtos/agent'
