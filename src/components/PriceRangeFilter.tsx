import { useState, useEffect, useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

type Props = {
  minPrice: number
  maxPrice: number
  onPriceChange: (min: number, max: number) => void
  defaultMin?: number
  defaultMax?: number
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onPriceChange,
  defaultMin = 0,
  defaultMax = 1000,
}: Props) {
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [inputMin, setInputMin] = useState(minPrice.toString())
  const [inputMax, setInputMax] = useState(maxPrice.toString())
  const debounceTimerRef = useRef<number | null>(null)

  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
    setInputMin(minPrice.toString())
    setInputMax(maxPrice.toString())
  }, [minPrice, maxPrice])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const debouncedPriceChange = (min: number, max: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onPriceChange(min, max)
    }, 500)
  }

  const handleSliderChange = (values: number[]) => {
    const [min, max] = values
    setPriceRange([min, max])
    setInputMin(min.toString())
    setInputMax(max.toString())
    debouncedPriceChange(min, max)
  }

  const handleMinInputChange = (value: string) => {
    setInputMin(value)
    const numValue = parseInt(value) || defaultMin
    if (numValue >= defaultMin && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]])
      onPriceChange(numValue, priceRange[1])
    }
  }

  const handleMaxInputChange = (value: string) => {
    setInputMax(value)
    const numValue = parseInt(value) || defaultMax
    if (numValue <= defaultMax && numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue])
      onPriceChange(priceRange[0], numValue)
    }
  }

  const formatPrice = (price: number, isMax: boolean = false) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)

    if (isMax && price >= defaultMax) {
      return formatted + '+'
    }

    return formatted
  }

  const isDefaultRange = priceRange[0] === defaultMin && priceRange[1] === defaultMax

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">Price Range</h3>
        {!isDefaultRange && (
          <button
            onClick={() => {
              setPriceRange([defaultMin, defaultMax])
              setInputMin(defaultMin.toString())
              setInputMax(defaultMax.toString())
              onPriceChange(defaultMin, defaultMax)
            }}
            className="text-xs text-muted-foreground cursor-pointer hover:text-foreground underline-offset-4 hover:underline transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      <Separator />

      <div className="space-y-4 pt-2">
        <div className="px-2">
          <Slider
            min={defaultMin}
            max={defaultMax}
            step={10}
            value={priceRange}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="min-price" className="text-xs text-muted-foreground">
              Min
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <Input
                id="min-price"
                type="number"
                min={defaultMin}
                max={priceRange[1]}
                value={inputMin}
                onChange={e => handleMinInputChange(e.target.value)}
                onBlur={() => {
                  const numValue = parseInt(inputMin) || defaultMin
                  if (numValue < defaultMin) {
                    setInputMin(defaultMin.toString())
                    setPriceRange([defaultMin, priceRange[1]])
                    onPriceChange(defaultMin, priceRange[1])
                  } else if (numValue > priceRange[1]) {
                    setInputMin(priceRange[1].toString())
                    setPriceRange([priceRange[1], priceRange[1]])
                    onPriceChange(priceRange[1], priceRange[1])
                  }
                }}
                className="pl-7 h-9"
              />
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <Label htmlFor="max-price" className="text-xs text-muted-foreground">
              Max
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <Input
                id="max-price"
                type="number"
                min={priceRange[0]}
                max={defaultMax}
                value={inputMax}
                onChange={e => handleMaxInputChange(e.target.value)}
                onBlur={() => {
                  const numValue = parseInt(inputMax) || defaultMax
                  if (numValue > defaultMax) {
                    setInputMax(defaultMax.toString())
                    setPriceRange([priceRange[0], defaultMax])
                    onPriceChange(priceRange[0], defaultMax)
                  } else if (numValue < priceRange[0]) {
                    setInputMax(priceRange[0].toString())
                    setPriceRange([priceRange[0], priceRange[0]])
                    onPriceChange(priceRange[0], priceRange[0])
                  }
                }}
                className="pl-7 h-9"
              />
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1], true)}
        </div>
      </div>
    </div>
  )
}
