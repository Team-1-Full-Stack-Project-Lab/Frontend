import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TripCard } from '../TripCard'
import type { Trip } from '@/types'

describe('TripCard', () => {
  const mockTrip: Trip = {
    id: 1,
    name: 'Summer Vacation',
    city: { id: 101, name: 'Paris', latitude: 0, longitude: 0, isCapital: false, isFeatured: false },
    destination: 'Paris, France',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-10'),
    durationDays: 10,
  }

  const mockOnEditTrip = vi.fn()
  const mockOnDeleteTrip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render trip name', () => {
      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      expect(screen.getByText('Summer Vacation')).toBeInTheDocument()
    })

    it('should render trip destination', () => {
      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      expect(screen.getByText('Paris, France')).toBeInTheDocument()
    })

    it('should render formatted dates', () => {
      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      expect(screen.getByText(/Jul 1 - Jul 10, 2024/)).toBeInTheDocument()
    })

    it('should render location and calendar icons', () => {
      const { container } = render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Dropdown Menu', () => {
    it('should show dropdown menu button', () => {
      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const menuButton = screen.getByRole('button')
      expect(menuButton).toBeInTheDocument()
    })

    it('should show edit and delete options when menu is opened', async () => {
      const user = userEvent.setup()

      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const menuButton = screen.getByRole('button')
      await user.click(menuButton)

      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onEditTrip when edit is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const menuButton = screen.getByRole('button')
      await user.click(menuButton)
      const editOption = screen.getByText('Edit')
      await user.click(editOption)
      expect(mockOnEditTrip).toHaveBeenCalledTimes(1)
      expect(mockOnEditTrip).toHaveBeenCalledWith(mockTrip)
    })

    it('should call onDeleteTrip when delete is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const menuButton = screen.getByRole('button')
      await user.click(menuButton)

      const deleteOption = screen.getByText('Delete')
      await user.click(deleteOption)

      expect(mockOnDeleteTrip).toHaveBeenCalledTimes(1)
      expect(mockOnDeleteTrip).toHaveBeenCalledWith(mockTrip)
    })

    it('should not trigger callbacks when menu is just opened', async () => {
      const user = userEvent.setup()

      render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const menuButton = screen.getByRole('button')
      await user.click(menuButton)

      expect(mockOnEditTrip).not.toHaveBeenCalled()
      expect(mockOnDeleteTrip).not.toHaveBeenCalled()
    })
  })

  describe('Different Trip Data', () => {
    it('should handle different trip names', () => {
      const customTrip = { ...mockTrip, name: 'Weekend Getaway' }

      render(
        <TripCard trip={customTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      expect(screen.getByText('Weekend Getaway')).toBeInTheDocument()
    })

    it('should handle different destinations', () => {
      const customTrip = { ...mockTrip, destination: 'Tokyo, Japan' }

      render(
        <TripCard trip={customTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument()
    })

    it('should format different date ranges correctly', () => {
      const customTrip = {
        ...mockTrip,
        startDate: new Date('2024-12-25'),
        endDate: new Date('2025-01-05'),
        durationDays: 12,
      }

      render(
        <TripCard trip={customTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      expect(screen.getByText(/Dec 25 - Jan 5, 2025/)).toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    it('should have gradient background', () => {
      const { container } = render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const card = container.querySelector('.bg-gradient-to-b')
      expect(card).toBeInTheDocument()
    })

    it('should be clickable (cursor-pointer)', () => {
      const { container } = render(
        <TripCard trip={mockTrip} onEditTrip={mockOnEditTrip} onDeleteTrip={mockOnDeleteTrip} onClick={() => {}} />
      )

      const card = container.querySelector('.cursor-pointer')
      expect(card).toBeInTheDocument()
    })
  })
})
