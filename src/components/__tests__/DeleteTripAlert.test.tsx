import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteTripAlert } from '../DeleteTripAlert'
import type { Trip } from '@/types/trips'

const mockDeleteTrip = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('@/hooks/useServices', () => ({
  useServices: () => ({
    tripService: {
      deleteTrip: mockDeleteTrip,
    },
  }),
}))

describe('DeleteTripAlert', () => {
  const mockTrip: Trip = {
    id: 1,
    name: 'Summer Trip to Paris',
    cityId: 1,
    destination: 'Paris, France',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-10T00:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Alert Rendering', () => {
    it('should render when open is true', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument()
    })

    it('should not render when open is false', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={false} onOpenChange={mockOnOpenChange} />)

      expect(screen.queryByText('Are you absolutely sure?')).not.toBeInTheDocument()
    })

    it('should display warning message', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
    })

    it('should display trip name in confirmation message', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByText(new RegExp(mockTrip.name))).toBeInTheDocument()
    })

    it('should display permanent deletion warning', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByText(/permanently delete/)).toBeInTheDocument()
    })

    it('should warn about associated data deletion', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByText(/associated stays/)).toBeInTheDocument()
    })
  })

  describe('Button Rendering', () => {
    it('should render cancel and delete buttons', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('should style delete button as destructive', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      expect(deleteButton).toHaveClass('bg-destructive')
    })
  })

  describe('Cancel Behavior', () => {
    it('should call onOpenChange when cancel is clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should NOT call deleteTrip when cancel is clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockDeleteTrip).not.toHaveBeenCalled()
    })

    it('should NOT call onSuccess when cancel is clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const mockOnSuccess = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('Delete Behavior', () => {
    it('should call deleteTrip when delete button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()

      mockDeleteTrip.mockResolvedValue(undefined)

      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockDeleteTrip).toHaveBeenCalledWith(mockTrip.id)
      })
    })

    it('should call onSuccess after successful deletion', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const mockOnSuccess = vi.fn()

      mockDeleteTrip.mockResolvedValue(undefined)

      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should call onOpenChange after successful deletion', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()

      mockDeleteTrip.mockResolvedValue(undefined)

      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Error Handling', () => {
    it('should show toast error on failed deletion', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const { toast } = await import('sonner')

      mockDeleteTrip.mockRejectedValue(new Error('Network error'))

      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete trip. Please try again.')
      })
    })

    it('should NOT call onSuccess on failed deletion', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const mockOnSuccess = vi.fn()
      const { toast } = await import('sonner')

      mockDeleteTrip.mockRejectedValue(new Error('Network error'))

      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} onSuccess={mockOnSuccess} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled()
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('Different Trip Data', () => {
    it('should display different trip name correctly', () => {
      const mockOnOpenChange = vi.fn()
      const differentTrip: Trip = {
        ...mockTrip,
        name: 'Winter Vacation in Tokyo',
      }

      render(<DeleteTripAlert trip={differentTrip} open={true} onOpenChange={mockOnOpenChange} />)

      expect(screen.getByText(/Winter Vacation in Tokyo/)).toBeInTheDocument()
    })

    it('should call deleteTrip with correct ID for different trip', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      const differentTrip: Trip = {
        ...mockTrip,
        id: 42,
        name: 'Beach Trip',
      }

      mockDeleteTrip.mockResolvedValue(undefined)

      render(<DeleteTripAlert trip={differentTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockDeleteTrip).toHaveBeenCalledWith(42)
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible cancel button', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toBeInTheDocument()
    })

    it('should have accessible delete button', () => {
      const mockOnOpenChange = vi.fn()
      render(<DeleteTripAlert trip={mockTrip} open={true} onOpenChange={mockOnOpenChange} />)

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      expect(deleteButton).toBeInTheDocument()
    })
  })
})
