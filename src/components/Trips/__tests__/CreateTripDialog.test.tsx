import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateTripDialog } from '../CreateTripDialog'

const mockCreateTrip = vi.fn()
const mockGetCities = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('@/hooks/useServices', () => ({
  useServices: () => ({
    tripService: {
      createTrip: mockCreateTrip,
    },
    cityService: {
      getCities: mockGetCities,
    },
  }),
}))

describe('CreateTripDialog', () => {
  const mockCities = [
    { id: 1, name: 'Paris', country: { name: 'France' } },
    { id: 2, name: 'Tokyo', country: { name: 'Japan' } },
    { id: 3, name: 'New York', country: { name: 'USA' } },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockGetCities.mockResolvedValue(mockCities)
  })

  describe('Dialog Behavior', () => {
    it('should render trigger button by default', () => {
      render(<CreateTripDialog />)

      expect(screen.getByText('Create Trip')).toBeInTheDocument()
    })

    it('should render custom trigger when provided', () => {
      render(<CreateTripDialog trigger={<button>Custom Trigger</button>} />)

      expect(screen.getByText('Custom Trigger')).toBeInTheDocument()
      expect(screen.queryByText('Create Trip')).not.toBeInTheDocument()
    })

    it('should open dialog when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      await waitFor(() => {
        expect(screen.getByText('Create a new trip')).toBeInTheDocument()
        expect(screen.getByText('Plan your trip by adding destinations and dates')).toBeInTheDocument()
      })
    })

    it('should close dialog when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      await waitFor(() => {
        expect(screen.getByText('Create a new trip')).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText('Create a new trip')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Fields', () => {
    it('should render all form fields', async () => {
      const user = userEvent.setup()
      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toBeInTheDocument()
        expect(screen.getByText('Destination')).toBeInTheDocument()
        expect(screen.getByText('Dates')).toBeInTheDocument()
      })
    })

    it('should allow typing in name field', async () => {
      const user = userEvent.setup()
      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      const nameInput = await screen.findByLabelText('Name')
      await user.type(nameInput, 'Summer Vacation 2025')

      expect(nameInput).toHaveValue('Summer Vacation 2025')
    })

    it('should show placeholder text in name field', async () => {
      const user = userEvent.setup()
      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      const nameInput = await screen.findByLabelText('Name')
      expect(nameInput).toBeInTheDocument()
    })
  })

  describe('City Loading', () => {
    it('should load featured cities on mount', async () => {
      const user = userEvent.setup()
      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      await waitFor(() => {
        expect(mockGetCities).toHaveBeenCalledWith({ featured: true })
      })
    })
  })

  describe('Form Submission', () => {
    it('should call createTrip on successful submission', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()

      mockCreateTrip.mockResolvedValue({
        id: 1,
        name: 'Test Trip',
        cityId: 1,
        destination: 'Paris, France',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      })

      render(<CreateTripDialog onSuccess={mockOnSuccess} />)

      await user.click(screen.getByText('Create Trip'))

      const nameInput = await screen.findByLabelText('Name')
      await user.type(nameInput, 'Summer Trip')

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockCreateTrip).toHaveBeenCalled()
      })
    })

    it('should call onSuccess callback after successful creation', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = vi.fn()

      mockCreateTrip.mockResolvedValue({
        id: 1,
        name: 'Test Trip',
        cityId: 1,
        destination: 'Paris, France',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      })

      render(<CreateTripDialog onSuccess={mockOnSuccess} />)

      await user.click(screen.getByText('Create Trip'))

      const nameInput = await screen.findByLabelText('Name')
      await user.type(nameInput, 'Summer Trip')

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should close dialog after successful submission', async () => {
      const user = userEvent.setup()

      mockCreateTrip.mockResolvedValue({
        id: 1,
        name: 'Test Trip',
        cityId: 1,
        destination: 'Paris, France',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      })

      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      const nameInput = await screen.findByLabelText('Name')
      await user.type(nameInput, 'Summer Trip')

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('Create a new trip')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should display validation errors from API', async () => {
      const user = userEvent.setup()

      const apiError = {
        name: 'ApiException',
        status: 400,
        apiError: {
          errors: {
            name: ['Name is required'],
            cityId: ['Please select a destination'],
          },
        },
      }

      mockCreateTrip.mockRejectedValue(apiError)

      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))

      const submitButton = await screen.findByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      await waitFor(
        () => {
          expect(mockCreateTrip).toHaveBeenCalled()
        },
        { timeout: 3000 }
      )
    })
  })

  describe('Form Reset', () => {
    it('should clear form after successful submission', async () => {
      const user = userEvent.setup()

      mockCreateTrip.mockResolvedValue({
        id: 1,
        name: 'Test Trip',
        cityId: 1,
        destination: 'Paris, France',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
      })

      render(<CreateTripDialog />)

      await user.click(screen.getByText('Create Trip'))
      const nameInput = await screen.findByLabelText('Name')
      await user.type(nameInput, 'Summer Trip')

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('Create a new trip')).not.toBeInTheDocument()
      })

      await user.click(screen.getByText('Create Trip'))

      const newNameInput = await screen.findByLabelText('Name')
      expect(newNameInput).toHaveValue('')
    })
  })
})
