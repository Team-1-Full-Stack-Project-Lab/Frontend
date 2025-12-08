import { createContext, useContext, useState, ReactNode } from 'react'

interface TripsDrawerContextType {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const TripsDrawerContext = createContext<TripsDrawerContextType | undefined>(undefined)

export function TripsDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)

  return (
    <TripsDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>{children}</TripsDrawerContext.Provider>
  )
}

export function useTripsDrawer() {
  const context = useContext(TripsDrawerContext)
  if (context === undefined) {
    throw new Error('useTripsDrawer must be used within a TripsDrawerProvider')
  }
  return context
}
