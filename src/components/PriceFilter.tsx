import { useEffect, useRef, useState } from 'react'
import 'nouislider/dist/nouislider.css'
import noUiSlider from 'nouislider'
import type { API } from 'nouislider'

type Props = {
  min?: number
  max?: number
  onChange?: (min: number, max: number) => void
}

export default function PriceFilter({ min = 80, max = 650, onChange }: Props) {
  const [localMin, setLocalMin] = useState<number>(min)
  const [localMax, setLocalMax] = useState<number>(max)

  const rangeRef = useRef<HTMLDivElement | null>(null)
  const minRef = useRef<HTMLInputElement | null>(null)
  const maxRef = useRef<HTMLInputElement | null>(null)
  const sliderRef = useRef<API | null>(null)

  useEffect(() => {
    setLocalMin(min)
    setLocalMax(max)
    if (sliderRef.current) {
       sliderRef.current.set([min, max])
    }
  }, [min, max])

  useEffect(() => {
    const rangeEl = rangeRef.current
    if (!rangeEl) return

    // Initialize slider
    noUiSlider.create(rangeEl, {
      start: [min, max],
      connect: true,
      range: {
        'min': 0,
        'max': 1000 // Assuming a fixed max range for now, or could be dynamic based on prices if needed, but user said "remove bars" implying less focus on data distribution
      },
      step: 1,
      format: {
        to: (v: number) => Math.round(v).toString(),
        from: (v: string) => Number(v)
      }
    })

    sliderRef.current = (rangeEl as any).noUiSlider

    const onUpdate = (values: (string | number)[]) => {
      const v0 = Math.round(Number(values[0]))
      const v1 = Math.round(Number(values[1]))
      setLocalMin(v0)
      setLocalMax(v1)
    }

    const onEnd = (values: (string | number)[]) => {
      const v0 = Math.round(Number(values[0]))
      const v1 = Math.round(Number(values[1]))
      onChange?.(v0, v1)
    }

    sliderRef.current?.on('update', onUpdate)
    sliderRef.current?.on('end', onEnd)

    return () => {
      sliderRef.current?.destroy()
    }
  }, []) // Empty dependency array to initialize once. Updates handled by other useEffects/refs if needed.

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setLocalMin(val)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setLocalMax(val)
  }

  const handleBlur = () => {
    let newMin = localMin
    let newMax = localMax

    if (newMin > newMax) {
      newMin = newMax
      setLocalMin(newMin)
    }
    
    sliderRef.current?.set([newMin, newMax])
    onChange?.(newMin, newMax)
  }

  return (
    <div className="mt-6">
      <div className="text-sm font-medium mb-2">Total Price</div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="block">
          <div className="text-xs text-muted-foreground">Minimum</div>
          <input 
            ref={minRef} 
            type="number" 
            value={localMin} 
            onChange={handleMinChange} 
            onBlur={handleBlur}
            className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500" 
          />
        </label>
        <label className="block">
          <div className="text-xs text-muted-foreground">Maximum</div>
          <input 
            ref={maxRef} 
            type="number" 
            value={localMax} 
            onChange={handleMaxChange} 
            onBlur={handleBlur}
            className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500" 
          />
        </label>
      </div>

      <div ref={rangeRef} className="mt-4 px-2"></div>
    </div>
  )
}
