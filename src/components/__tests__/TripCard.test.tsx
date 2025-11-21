import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TripCard } from '../TripCard'
import type { Trip } from '@/types/trips'

/**
 * LEARNING: Testing Presentation Components
 *
 * For simpler components that display data and handle user interactions:
 * 1. Test that props are rendered correctly
 * 2. Test user interactions (clicks, hovers)
 * 3. Test callbacks are triggered
 * 4. Test conditional rendering
 */

describe('TripCard', () => {
  const mockTrip: Trip = {
    id: 1,
    name: 'Summer Vacation',
    cityId: 101,
    destination: 'Paris, France',
    startDate: '2024-07-01',
    endDate: '2024-07-10',
  }

  const mockOnEditTrip = vi.fn()
  const mockOnDeleteTrip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render trip name', () => {
      // LEARNING: Basic rendering test
      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      expect(screen.getByText('Summer Vacation')).toBeInTheDocument()
    })

    it('should render trip destination', () => {
      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      expect(screen.getByText('Paris, France')).toBeInTheDocument()
    })

    it('should render formatted dates', () => {
      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      // LEARNING: Test date formatting
      // July 1 - July 10, 2024
      expect(screen.getByText(/Jul 1 - Jul 10, 2024/)).toBeInTheDocument()
    })

    it('should render location and calendar icons', () => {
      const { container } = render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />
      )

      // LEARNING: Testing for SVG icons (lucide-react uses SVG)
      // Icons are present in the DOM even if not directly testable by text
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Dropdown Menu', () => {
    it('should show dropdown menu button', () => {
      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      // LEARNING: Find button by role and accessibility
      const menuButton = screen.getByRole('button')
      expect(menuButton).toBeInTheDocument()
    })

    it('should show edit and delete options when menu is opened', async () => {
      const user = userEvent.setup()

      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      // LEARNING: Open dropdown menu
      const menuButton = screen.getByRole('button')
      await user.click(menuButton)

      // LEARNING: Check for menu items
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onEditTrip when edit is clicked', async () => {
      const user = userEvent.setup()

      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      // LEARNING: Simulate user interaction flow
      // 1. Open menu
      const menuButton = screen.getByRole('button')
      await user.click(menuButton)

      // 2. Click edit option
      const editOption = screen.getByText('Edit')
      await user.click(editOption)

      // LEARNING: Verify callback was called with correct data
      expect(mockOnEditTrip).toHaveBeenCalledTimes(1)
      expect(mockOnEditTrip).toHaveBeenCalledWith(mockTrip)
    })

    it('should call onDeleteTrip when delete is clicked', async () => {
      const user = userEvent.setup()

      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      // Open menu
      const menuButton = screen.getByRole('button')
      await user.click(menuButton)

      // Click delete option
      const deleteOption = screen.getByText('Delete')
      await user.click(deleteOption)

      // LEARNING: Verify delete callback
      expect(mockOnDeleteTrip).toHaveBeenCalledTimes(1)
      expect(mockOnDeleteTrip).toHaveBeenCalledWith(mockTrip)
    })

    it('should not trigger callbacks when menu is just opened', async () => {
      const user = userEvent.setup()

      render(<TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      // LEARNING: Test that callbacks are NOT called when they shouldn't be
      const menuButton = screen.getByRole('button')
      await user.click(menuButton)

      expect(mockOnEditTrip).not.toHaveBeenCalled()
      expect(mockOnDeleteTrip).not.toHaveBeenCalled()
    })
  })

  describe('Different Trip Data', () => {
    it('should handle different trip names', () => {
      const customTrip = { ...mockTrip, name: 'Weekend Getaway' }

      render(<TripCard trip={customTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      expect(screen.getByText('Weekend Getaway')).toBeInTheDocument()
    })

    it('should handle different destinations', () => {
      const customTrip = { ...mockTrip, destination: 'Tokyo, Japan' }

      render(<TripCard trip={customTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument()
    })

    it('should format different date ranges correctly', () => {
      // LEARNING: Test edge cases with dates
      const customTrip = {
        ...mockTrip,
        startDate: '2024-12-25',
        endDate: '2025-01-05',
      }

      render(<TripCard trip={customTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />)

      // Crosses year boundary
      expect(screen.getByText(/Dec 25 - Jan 5, 2025/)).toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    it('should have gradient background', () => {
      const { container } = render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />
      )

      // LEARNING: Test CSS classes for styling
      const card = container.querySelector('.bg-gradient-to-b')
      expect(card).toBeInTheDocument()
    })

    it('should be clickable (cursor-pointer)', () => {
      const { container } = render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} />
      )

      const card = container.querySelector('.cursor-pointer')
      expect(card).toBeInTheDocument()
    })
  })
})
