import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DateRangePickerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = 'Pick a date range',
  ...props
}: DateRangePickerProps) {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(date)

  const handleDateChange = (newDate: DateRange | undefined) => {
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate?.from ? (
            selectedDate.to ? (
              <>
                {format(selectedDate.from, 'LLL dd, y')} - {format(selectedDate.to, 'LLL dd, y')}
              </>
            ) : (
              format(selectedDate.from, 'LLL dd, y')
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={selectedDate?.from}
          selected={selectedDate}
          onSelect={handleDateChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
