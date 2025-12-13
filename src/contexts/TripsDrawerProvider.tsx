import { useState, useCallback } from 'react'
import { TripsDrawerContext, type TripInitialValues } from './TripsDrawerContext'

type TripsDrawerProviderProps = {
  children: React.ReactNode
}

export function TripsDrawerProvider({ children }: TripsDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialValues, setInitialValues] = useState<TripInitialValues | undefined>()
  const [defaultInitialValues, setDefaultInitialValues] = useState<TripInitialValues | undefined>()

  const openDrawer = useCallback(
    (values?: TripInitialValues) => {
      setInitialValues(values || defaultInitialValues)
      setIsOpen(true)
    },
    [defaultInitialValues]
  )

  const closeDrawer = useCallback(() => {
    setIsOpen(false)
    setInitialValues(undefined)
  }, [])

  return (
    <TripsDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, setDefaultInitialValues, initialValues }}>
      {children}
    </TripsDrawerContext.Provider>
  )
}
