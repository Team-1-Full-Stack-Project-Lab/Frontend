import { useEffect, useRef, useState } from 'react'
import 'nouislider/dist/nouislider.css'
import noUiSlider from 'nouislider'
import ApexCharts from 'apexcharts'
import debounce from 'lodash/debounce'

type Props = {
  prices?: number[]
  min?: number
  max?: number
  onChange?: (min: number, max: number) => void
}

export default function PriceFilter({ prices, min = 80, max = 650, onChange }: Props) {
  const [localMin, setLocalMin] = useState<number>(min)
  const [localMax, setLocalMax] = useState<number>(max)

  const rangeRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const fgRef = useRef<HTMLDivElement | null>(null)
  const minRef = useRef<HTMLInputElement | null>(null)
  const maxRef = useRef<HTMLInputElement | null>(null)
  const prevMinRef = useRef<number>(min)
  const prevMaxRef = useRef<number>(max)
  const isDraggingRef = useRef<boolean>(false)

  function updateMin(v: number) {
    setLocalMin(v)
  }

  function updateMax(v: number) {
    setLocalMax(v)
  }

  useEffect(() => {
    const rangeEl = rangeRef.current
    const bgEl = bgRef.current
    const fgEl = fgRef.current
    const minEl = minRef.current
    const maxEl = maxRef.current

  if (!rangeEl || !bgEl || !fgEl || !minEl || !maxEl) return

  // Dynamic bucket bounds from prices (fallback to [0,1000])
  const computedMin = prices && prices.length > 0 ? Math.floor(Math.min(...prices)) : 0
  const computedMaxRaw = prices && prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000
  // overflow cap: show a 650+ area so very expensive items are visible in the right-most bucket
  const overflowCap = 650
  const computedMax = Math.max(computedMaxRaw, overflowCap)

    const bucketCount = 29
    const bucketWidth = (computedMax - computedMin) / bucketCount || 1

  const histogramData = (() => {
      if (prices && prices.length > 0) {
        const buckets = new Array(bucketCount).fill(0)
        prices.forEach((p: number) => {
          const priceNum = Number(p) || 0
            // if price exceeds overflowCap, put into last bucket so it appears under '650+'
            let idx = Math.min(buckets.length - 1, Math.max(0, Math.floor((priceNum - computedMin) / bucketWidth)))
            if (priceNum > overflowCap) idx = buckets.length - 1
          buckets[idx]++
        })
        return buckets
      }
      // fallback synthetic data
      return new Array(bucketCount).fill(0).map((_, i) => 10 + Math.round(30 * Math.abs(Math.sin(i))))
    })()

    // build categories labels for x-axis; last bucket shows overflowCap+'+'
    const categories = new Array(bucketCount).fill(0).map((_, idx) => {
      if (idx === bucketCount - 1) return `${overflowCap}+`
      const bucketMin = computedMin + idx * bucketWidth
      return `${Math.round(bucketMin)}`
    })

    const getForegroundSeries = (selMin: number, selMax: number) => {
      const fg = histogramData.map((count, idx) => {
        const bucketMin = computedMin + idx * bucketWidth
        // last bucket represents overflowCap..computedMax
        const bucketMax = idx === histogramData.length - 1 ? computedMax : (computedMin + (idx + 1) * bucketWidth)
        if (bucketMax < selMin || bucketMin > selMax) return 0
        return count
      })
      return fg
    }

    let bgChart: ApexCharts | null = null
    let fgChart: ApexCharts | null = null
    let slider: any = null

    try {
      bgChart = new ApexCharts(bgEl, {
        series: [{ name: 'Sales', data: histogramData }],
        chart: { height: 150, type: 'bar', sparkline: { enabled: true } },
        xaxis: { categories },
        tooltip: { enabled: false },
        colors: ['#f3f4f6'],
        plotOptions: { bar: { columnWidth: '60%' } },
        grid: { borderColor: '#e5e7eb' }
      })
      bgChart.render()

      fgChart = new ApexCharts(fgEl, {
        series: [{ name: 'Sales', data: histogramData }],
        chart: { height: 150, type: 'bar', sparkline: { enabled: true } },
        xaxis: { categories },
        tooltip: { enabled: false },
        colors: ['#3b82f6'],
        plotOptions: { bar: { columnWidth: '60%' } },
        grid: { borderColor: '#e5e7eb' }
      })
      fgChart.render()

      noUiSlider.create(rangeEl, {
        start: [Math.max(localMin, computedMin), Math.min(localMax, computedMax)],
        connect: true,
        range: { min: computedMin, max: computedMax },
        format: {
          to: (v: number) => Math.round(v).toString(),
          from: (v: string) => Number(v)
        }
      })

  slider = (rangeEl as any)

  // initialize prev refs
  prevMinRef.current = localMin
  prevMaxRef.current = localMax

      const onUpdate = (values: string[]) => {
        const v0 = Math.round(Number(values[0]))
        const v1 = Math.round(Number(values[1]))
        // update inputs and local state for smooth UI, but don't notify parent yet
        minEl.value = String(v0)
        maxEl.value = String(v1)
        setLocalMin(v0)
        setLocalMax(v1)
      }

      const onStart = () => {
        isDraggingRef.current = true
      }

      const debouncedUpdate = debounce((v0: number, v1: number) => {
        try {
          const fgData = getForegroundSeries(v0, v1)
          fgChart?.updateSeries([{ name: 'Sales', data: fgData }], false)
        } catch { }
      }, 120)

      const onEnd = (values: string[]) => {
        const v0 = Math.round(Number(values[0]))
        const v1 = Math.round(Number(values[1]))
        isDraggingRef.current = false
        debouncedUpdate(v0, v1)
        prevMinRef.current = v0
        prevMaxRef.current = v1
        onChange?.(v0, v1)
      }

  slider.noUiSlider.on('start', onStart)
  slider.noUiSlider.on('update', onUpdate)
  slider.noUiSlider.on('end', onEnd)

      // input handling: allow free typing while editing. Apply changes on blur.
      const minBlur = () => {
        const newMin = Math.round(Number(minEl.value) || 0)
        const curMax = Math.round(Number(maxEl.value) || 0)
        // if invalid after commit (min > curMax) -> revert to previous valid
        if (newMin > curMax) {
          minEl.value = String(prevMinRef.current)
          setLocalMin(prevMinRef.current)
        } else {
          try { slider.noUiSlider.set([newMin, curMax]) } catch { }
          prevMinRef.current = newMin
          prevMaxRef.current = curMax
          try { fgChart?.updateSeries([{ name: 'Sales', data: getForegroundSeries(newMin, curMax) }], false) } catch { }
        }
      }

      const maxBlur = () => {
        const newMax = Math.round(Number(maxEl.value) || 0)
        const curMin = Math.round(Number(minEl.value) || 0)
        // if invalid after commit (newMax < curMin) -> revert to previous valid
        if (newMax < curMin) {
          maxEl.value = String(prevMaxRef.current)
          setLocalMax(prevMaxRef.current)
        } else {
          try { slider.noUiSlider.set([curMin, newMax]) } catch { }
          prevMinRef.current = curMin
          prevMaxRef.current = newMax
          try { fgChart?.updateSeries([{ name: 'Sales', data: getForegroundSeries(curMin, newMax) }], false) } catch { }
        }
      }
      minEl.addEventListener('blur', minBlur)
      maxEl.addEventListener('blur', maxBlur)

      const resizeHandler = () => {
        // ApexCharts will handle resizing. Keep a no-op resize handler in case we need it later.
        try {
          fgChart?.render()
          bgChart?.render()
        } catch { }
      }
      // initialize foreground series on first render
      try {
        const initValues = slider.noUiSlider.get()
        const initMin = Math.round(Number(initValues[0]))
        const initMax = Math.round(Number(initValues[1]))
        const fgInit = getForegroundSeries(initMin, initMax)
        fgChart?.updateSeries([{ name: 'Sales', data: fgInit }], false)
      } catch { }

  window.addEventListener('resize', resizeHandler)

      return () => {
        try {
          if (slider && slider.noUiSlider) slider.noUiSlider.destroy()
        } catch { }
        try { bgChart?.destroy() } catch { }
        try { fgChart?.destroy() } catch { }
        minEl.removeEventListener('blur', minBlur)
        maxEl.removeEventListener('blur', maxBlur)
        window.removeEventListener('resize', resizeHandler)
        try { debouncedUpdate.cancel() } catch { }
      }
    } catch (err) {
      try { bgChart?.destroy() } catch { }
      try { fgChart?.destroy() } catch { }
      return
    }
  }, [onChange, localMin, localMax, prices])

  return (
    <div className="mt-6">
      <div className="text-sm font-medium mb-2">Precio total</div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="block">
          <div className="text-xs text-muted-foreground">Mínimo</div>
          <input ref={minRef} id="hs-pass-charts-values-to-inputs-min-target" type="number" value={localMin} onChange={(e) => updateMin(Number(e.target.value) || 0)} className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500" />
        </label>
        <label className="block">
          <div className="text-xs text-muted-foreground">Máximo</div>
          <input ref={maxRef} id="hs-pass-charts-values-to-inputs-max-target" type="number" value={localMax} onChange={(e) => updateMax(Number(e.target.value) || 0)} className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500" />
        </label>
      </div>

      <label className="sr-only">Example range</label>
      <div className="relative">
        <div ref={bgRef} id="hs-range-with-charts-bar-chart-background" className="h-16" />
        <div className="absolute top-0 start-0 inset-0 overflow-hidden">
          <div ref={fgRef} id="hs-range-with-charts-bar-chart-foreground" className="h-16" />
        </div>
      </div>

      <div ref={rangeRef} id="hs-range-with-charts" className="mt-4 --prevent-on-load-init" data-hs-range-slider='{"start": [250, 750], "range": {"min": 0, "max": 1000}, "connect": true, "formatter": "integer"}'></div>
    </div>
  )
}
