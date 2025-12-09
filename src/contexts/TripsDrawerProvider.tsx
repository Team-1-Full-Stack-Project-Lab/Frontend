import { useState } from 'react'
import { TripsDrawerContext } from './TripsDrawerContext'

type TripsDrawerProviderProps = {
  children: React.ReactNode
}

export function TripsDrawerProvider({ children }: TripsDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)

  return (
    <TripsDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>{children}</TripsDrawerContext.Provider>
  )
}
