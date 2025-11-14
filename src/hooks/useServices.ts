import { API_MODE } from '@/config/api'
import { services } from '@/services'

export function useServices() {
  const apiMode = API_MODE as keyof typeof services
  return {
    mode: apiMode,
    authService: services[apiMode].auth,
    userService: services[apiMode].user,
    tripService: services[apiMode].trip,
    cityService: services[apiMode].city,
    stayService: services[apiMode].stay,
  }
}
