import { createContext } from 'react'

export type TripsDrawerState = {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

export const TripsDrawerContext = createContext<TripsDrawerState | undefined>(undefined)
