import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  className?: string
  options: SearchableSelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  onQueryChange?: (query: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
}

export function SearchableSelect({
  className,
  options,
  value,
  onValueChange,
  onQueryChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find(option => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal', !selectedOption && 'text-muted-foreground', className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={!onQueryChange}>
          <CommandInput placeholder={searchPlaceholder} onValueChange={value => onQueryChange?.(value)} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={currentValue => {
                    onValueChange?.(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
