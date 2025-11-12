import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import TripsPage from './TripsPage'
import * as tripService from '@/services/rest/tripService'
import type { Trip } from '@/types'

/**
 * LEARNING: Component Testing with React Testing Library
 * 
 * Key principles:
 * 1. Test user behavior, not implementation details
 * 2. Query elements the way users would (by text, role, label)
 * 3. Test what the user sees and interacts with
 * 4. Mock external dependencies (services, APIs)
 */

// Mock the trip service module
vi.mock('@/services/rest/tripService')

// Mock the child components to simplify testing
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

/**
 * LEARNING: Wrapper Component for React Router
 * 
 * Many React apps use routing. We need to wrap our component
 * in a Router for tests, or we'll get errors.
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('TripsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Empty State', () => {
    it('should show empty state when no trips exist', async () => {
      // LEARNING: Mock the service to return empty array
      vi.mocked(tripService.getTrips).mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      // LEARNING: Wait for async data to load
      await waitFor(() => {
        expect(screen.getByText(/You have no upcoming trips/i)).toBeInTheDocument()
      })

      // LEARNING: Verify the heading is still shown
      expect(screen.getByText('My Trips')).toBeInTheDocument()
    })

    it('should show create trip button in empty state', async () => {
      vi.mocked(tripService.getTrips).mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      await waitFor(() => {
        expect(screen.getByTestId('create-trip-dialog')).toBeInTheDocument()
      })
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
      // LEARNING: Mock service to return multiple trips
      vi.mocked(tripService.getTrips).mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      // LEARNING: Wait for all trips to appear
      await waitFor(() => {
        expect(screen.getByText('Summer Vacation')).toBeInTheDocument()
        expect(screen.getByText('Winter Trip')).toBeInTheDocument()
      })

      // LEARNING: Verify destinations are shown
      expect(screen.getByText('Paris, France')).toBeInTheDocument()
      expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument()
    })

    it('should render correct number of trip cards', async () => {
      vi.mocked(tripService.getTrips).mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(() => {
        expect(screen.getByTestId('trip-card-1')).toBeInTheDocument()
        expect(screen.getByTestId('trip-card-2')).toBeInTheDocument()
      })
    })

    it('should not show empty state when trips exist', async () => {
      vi.mocked(tripService.getTrips).mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(() => {
        expect(screen.getByText('Summer Vacation')).toBeInTheDocument()
      })

      // LEARNING: Verify empty state message is NOT present
      expect(screen.queryByText(/You have no upcoming trips/i)).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should load trips when component mounts', async () => {
      // LEARNING: Test side effects (API calls)
      vi.mocked(tripService.getTrips).mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      // LEARNING: Verify service was called on mount
      await waitFor(() => {
        expect(tripService.getTrips).toHaveBeenCalledTimes(1)
      })
    })

    it('should reload trips when create trip dialog succeeds', async () => {
      const user = userEvent.setup()
      vi.mocked(tripService.getTrips).mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      await waitFor(() => {
        expect(screen.getByTestId('create-trip-dialog')).toBeInTheDocument()
      })

      // LEARNING: Simulate user clicking create button
      const createButton = screen.getByTestId('create-trip-dialog')
      await user.click(createButton)

      // LEARNING: Verify trips are reloaded after creation
      await waitFor(() => {
        expect(tripService.getTrips).toHaveBeenCalledTimes(2)
      })
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

      vi.mocked(tripService.getTrips).mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Trip')).toBeInTheDocument()
      })

      // LEARNING: Find and click edit button
      const editButton = screen.getByText('Edit')
      await user.click(editButton)

      // LEARNING: Verify edit dialog appears
      await waitFor(() => {
        expect(screen.getByTestId('edit-trip-dialog')).toBeInTheDocument()
      })
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

      vi.mocked(tripService.getTrips).mockResolvedValue(mockTrips)

      renderWithRouter(<TripsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Trip')).toBeInTheDocument()
      })

      // LEARNING: Find and click delete button
      const deleteButton = screen.getByText('Delete')
      await user.click(deleteButton)

      // LEARNING: Verify delete alert appears
      await waitFor(() => {
        expect(screen.getByTestId('delete-trip-alert')).toBeInTheDocument()
      })
    })
  })

  describe('Page Metadata', () => {
    it('should set the correct page title', async () => {
      vi.mocked(tripService.getTrips).mockResolvedValue([])

      renderWithRouter(<TripsPage />)

      // LEARNING: Test document title
      await waitFor(() => {
        expect(document.title).toBe('My Trips')
      })
    })
  })
})
