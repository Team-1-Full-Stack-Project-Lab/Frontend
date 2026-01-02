import { TripsDrawerContext } from '@/contexts/TripsDrawerContext'
import { useContext } from 'react'

export function useTripsDrawer() {
  const context = useContext(TripsDrawerContext)
  if (context === undefined) {
    throw new Error('useTripsDrawer must be used within a TripsDrawerProvider')
  }
  return context
}
