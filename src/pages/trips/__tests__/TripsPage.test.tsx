import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import TripsPage from '../TripsPage'
import type { Trip } from '@/types'

const mockGetTrips = vi.fn()
vi.mock('@/hooks/useServices', () => ({
  useServices: () => ({
    tripService: {
      getTrips: mockGetTrips,
    },
  }),
}))

vi.mock('@/components/CreateTripDialog', () => ({
  CreateTripDialog: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess} data-testid="create-trip-dialog">
      Create Trip
    </button>
  ),
}))

vi.mock('@/components/TripCard', () => ({
  TripCard: ({
    trip,
    onEditTrip,
    onDeleteTrip,
  }: {
    trip: Trip
    onEditTrip: (trip: Trip) => void
    onDeleteTrip: (trip: Trip) => void
  }) => (
    <div data-testid={`trip-card-${trip.id}`}>
      <h3>{trip.name}</h3>
      <p>{trip.destination}</p>
      <button onClick={() => onEditTrip(trip)}>Edit</button>
      <button onClick={() => onDeleteTrip(trip)}>Delete</button>
    </div>
  ),
}))

vi.mock('@/components/EditTripDialog', () => ({
  EditTripDialog: () => <div data-testid="edit-trip-dialog">Edit Dialog</div>,
}))

vi.mock('@/components/DeleteTripAlert', () => ({
  DeleteTripAlert: () => <div data-testid="delete-trip-alert">Delete Alert</div>,
}))

vi.mock('@/components/TripStayUnitsDialog', () => ({
  TripStayUnitsDialog: () => <div data-testid="trip-stay-units-dialog">Stay Units Dialog</div>,
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('TripsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Empty State', () => {
    it('should show empty state when no trips exist', async () => {
      mockGetTrips.mockResolvedValue([])

      renderWithRouter(<TripsPage />)
      await waitFor(
        () => {
          expect(screen.getByText(/You have no upcoming trips/i)).toBeInTheDocument()
        },
        { timeout: 5000 }
      )

      expect(screen.getByText('My Trips')).toBeInTheDocument()
    })

    it('should show create trip button in empty state', async () => {
      mockGetTrips.mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(screen.getByTestId('create-trip-dialog')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )
    })
  })

  describe('With Trips', () => {
    const mockTrips: Trip[] = [
      {
        id: 1,
        name: 'Summer Vacation',
        cityId: 101,
        destination: 'Paris, France',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      },
      {
        id: 2,
        name: 'Winter Trip',
        cityId: 202,
        destination: 'Tokyo, Japan',
        startDate: '2024-12-20',
        endDate: '2024-12-28',
      },
    ]

    it('should render trip cards when trips exist', async () => {
      mockGetTrips.mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(screen.getByText('Summer Vacation')).toBeInTheDocument()
          expect(screen.getByText('Winter Trip')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )

      expect(screen.getByText('Paris, France')).toBeInTheDocument()
      expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument()
    })

    it('should render correct number of trip cards', async () => {
      mockGetTrips.mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(screen.getByTestId('trip-card-1')).toBeInTheDocument()
          expect(screen.getByTestId('trip-card-2')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )
    })

    it('should not show empty state when trips exist', async () => {
      mockGetTrips.mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(screen.getByText('Summer Vacation')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )

      expect(screen.queryByText(/You have no upcoming trips/i)).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should load trips when component mounts', async () => {
      mockGetTrips.mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(mockGetTrips).toHaveBeenCalledTimes(1)
        },
        { timeout: 5000 }
      )
    })

    it('should reload trips when create trip dialog succeeds', async () => {
      const user = userEvent.setup()
      mockGetTrips.mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(screen.getByTestId('create-trip-dialog')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )

      const createButton = screen.getByTestId('create-trip-dialog')
      await user.click(createButton)

      await waitFor(
        () => {
          expect(mockGetTrips).toHaveBeenCalledTimes(2)
        },
        { timeout: 5000 }
      )
    })

    it('should show edit dialog when edit button is clicked', async () => {
      const user = userEvent.setup()
      const mockTrips: Trip[] = [
        {
          id: 1,
          name: 'Test Trip',
          cityId: 1,
          destination: 'Test, Country',
          startDate: '2024-01-01',
          endDate: '2024-01-05',
        },
      ]

      mockGetTrips.mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(screen.getByText('Test Trip')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )

      const editButton = screen.getByText('Edit')
      await user.click(editButton)

      await waitFor(
        () => {
          expect(screen.getByTestId('edit-trip-dialog')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )
    })

    it('should show delete alert when delete button is clicked', async () => {
      const user = userEvent.setup()
      const mockTrips: Trip[] = [
        {
          id: 1,
          name: 'Test Trip',
          cityId: 1,
          destination: 'Test, Country',
          startDate: '2024-01-01',
          endDate: '2024-01-05',
        },
      ]

      mockGetTrips.mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(screen.getByText('Test Trip')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )

      const deleteButton = screen.getByText('Delete')
      await user.click(deleteButton)

      await waitFor(
        () => {
          expect(screen.getByTestId('delete-trip-alert')).toBeInTheDocument()
        },
        { timeout: 5000 }
      )
    })
  })

  describe('Page Metadata', () => {
    it('should set the correct page title', async () => {
      mockGetTrips.mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      await waitFor(
        () => {
          expect(document.title).toBe('My Trips')
        },
        { timeout: 5000 }
      )
    })
  })
})
