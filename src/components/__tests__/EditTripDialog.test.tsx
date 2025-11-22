import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTripDialog } from '../EditTripDialog'
import type { Trip } from '@/types/trips'

const mockUpdateTrip = vi.fn()
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
      updateTrip: mockUpdateTrip,
    },
    cityService: {
      getCities: mockGetCities,
    },
  }),
}))

describe('EditTripDialog', () => {
  const mockTrip: Trip = {
    id: 1,
    name: 'Summer Trip to Paris',
    cityId: 1,
    destination: 'Paris, France',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-10T00:00:00Z',
  }

  const mockCities = [
    { id: 1, name: 'Paris', country: { name: 'France' } },
    { id: 2, name: 'Tokyo', country: { name: 'Japan' } },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCities.mockResolvedValue(mockCities)
  })

  describe('Dialog Behavior', () => {
    it('should render when open is true', () => {
      const mockOnOpenChange = vi.fn()
      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByText('Edit trip')).toBeInTheDocument()
      expect(screen.getByText("Update the details of your trip. Click save when you're done.")).toBeInTheDocument()
    })

    it('should not render when open is false', () => {
      const mockOnOpenChange = vi.fn()
      render(<EditTripDialog trip={mockTrip} open={false} onOpenChange={mockOnOpenChange} />)

      expect(screen.queryByText('Edit trip')).not.toBeInTheDocument()
    })
  })

  describe('Form Pre-filling', () => {
    it('should pre-fill form with trip data', async () => {
      const mockOnOpenChange = vi.fn()
      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const nameInput = screen.getByLabelText('Name') as HTMLInputElement
      expect(nameInput.value).toBe(mockTrip.name)
    })
  })

  describe('Form Editing', () => {
    it('should allow editing the name field', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const nameInput = screen.getByLabelText('Name')

      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Trip Name')

      expect(nameInput).toHaveValue('Updated Trip Name')
    })

    it('should call updateTrip on submission', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const mockOnSuccess = vi.fn()

      mockUpdateTrip.mockResolvedValue({
        ...mockTrip,
        name: 'Updated Trip',
      })

      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText('Name')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Trip')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateTrip).toHaveBeenCalledWith(mockTrip.id, expect.any(Object))
      })
    })

    it('should call onSuccess after successful update', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const mockOnSuccess = vi.fn()

      mockUpdateTrip.mockResolvedValue({
        ...mockTrip,
        name: 'Updated Trip',
      })

      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

      const nameInput = screen.getByLabelText('Name')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Trip')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should update trip with modified name', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()

      mockUpdateTrip.mockResolvedValue({
        ...mockTrip,
        name: 'Winter Vacation',
      })

      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const nameInput = screen.getByLabelText('Name')
      await user.clear(nameInput)
      await user.type(nameInput, 'Winter Vacation')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateTrip).toHaveBeenCalledWith(
          mockTrip.id,
          expect.objectContaining({
            name: 'Winter Vacation',
          })
        )
      })
    })
  })

  describe('Cancel Behavior', () => {
    it('should call onOpenChange when cancel is clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Error Handling', () => {
    it('should display validation errors from API', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()

      const apiError = {
        name: 'ApiException',
        status: 400,
        apiError: {
          errors: {
            name: ['Name cannot be empty'],
          },
        },
      }

      mockUpdateTrip.mockRejectedValue(apiError)

      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const nameInput = screen.getByLabelText('Name')
      await user.clear(nameInput)

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(
        () => {
          expect(mockUpdateTrip).toHaveBeenCalled()
        },
        { timeout: 3000 }
      )
    })

    it('should show toast error on failed update', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const { toast } = await import('sonner')

      mockUpdateTrip.mockRejectedValue(new Error('Network error'))

      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update trip. Please try again.')
      })
    })
  })

  describe('City Loading', () => {
    it('should load featured cities on mount', async () => {
      const mockOnOpenChange = vi.fn()
      render(<EditTripDialog trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(mockGetCities).toHaveBeenCalledWith({ featured: true })
    })
  })
})
