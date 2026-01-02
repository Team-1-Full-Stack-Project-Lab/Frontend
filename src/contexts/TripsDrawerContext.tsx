import { createContext } from 'react'
import type { DateRange } from 'react-day-picker'

export type TripInitialValues = {
  cityId?: number
  dateRange?: DateRange
}

export type TripsDrawerState = {
  isOpen: boolean
  openDrawer: (initialValues?: TripInitialValues) => void
  closeDrawer: () => void
  setDefaultInitialValues: (values?: TripInitialValues) => void
  initialValues?: TripInitialValues
}

export const TripsDrawerContext = createContext<TripsDrawerState | undefined>(undefined)
