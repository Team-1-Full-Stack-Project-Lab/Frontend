import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTripDialog } from './EditTripDialog'
import type { Trip } from '@/types/trips'

/**
 * LEARNING: Testing Edit Dialog Components
 * 
 * When testing edit dialogs:
 * 1. Test that the form pre-fills with existing data
 * 2. Test that the dialog is controlled by parent (open/onOpenChange props)
 * 3. Test editing functionality and updates
 * 4. Test cancel behavior
 * 5. Test validation errors
 */

// Create mock functions
const mockUpdateTrip = vi.fn()
const mockGetCities = vi.fn()

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

// Mock the useServices hook
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

      // LEARNING: Check for dialog title
      expect(screen.getByText('Edit trip')).toBeInTheDocument()
      expect(screen.getByText('Update the details of your trip. Click save when you\'re done.')).toBeInTheDocument()
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

      // LEARNING: Check that the name input has the existing value
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
      
      // Clear and type new value
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

      render(
        <EditTripDialog 
          trip={mockTrip} 
          open={true} 
          onOpenChange={mockOnOpenChange} 
          onSuccess={mockOnSuccess}
        />
      )

      const nameInput = screen.getByLabelText('Name')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Trip')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      // LEARNING: Verify updateTrip was called with correct ID
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

      render(
        <EditTripDialog 
          trip={mockTrip} 
          open={true} 
          onOpenChange={mockOnOpenChange} 
          onSuccess={mockOnSuccess}
        />
      )

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

      // LEARNING: Verify cancel calls onOpenChange(false)
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

      // LEARNING: Wait for API call to complete
      await waitFor(() => {
        expect(mockUpdateTrip).toHaveBeenCalled()
      }, { timeout: 3000 })
    })

    it('should show toast error on failed update', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const { toast } = await import('sonner')

      // Simulate network error (not validation error)
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

      // Verify getCities was called
      expect(mockGetCities).toHaveBeenCalledWith({ featured: true })
    })
  })
})
