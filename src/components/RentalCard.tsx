import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useState } from 'react'
import { SaveToTripPopover } from '@/components/SaveToTripPopover'
import type { Stay } from '@/types/stays'

type Props = {
  title: string
  location: string
  pricePerNight: string
  tag?: string
  images?: string[]
  id?: string
}

export default function RentalCard({ title, location, pricePerNight, tag, images, id }: Props) {
  const imgs = images && images.length > 0 ? images : ['/background.webp']
  const [index, setIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const prev = () => setIndex((i) => (i - 1 + imgs.length) % imgs.length)
  const next = () => setIndex((i) => (i + 1) % imgs.length)

  const stay: Stay = {
    id: id || crypto.randomUUID(),
    title,
    location,
    pricePerNight,
    images,
  }

  const handleSaved = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2500)
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 shadow-lg animate-in fade-in slide-in-from-top-5">
          <p className="font-medium">Saved to trip!</p>
        </div>
      )}
      <Card className="w-full max-w-full flex-row flex items-stretch gap-0 p-0 rounded-lg h-52">
        {/* Left: image area */}
        <div className="w-2/5 shrink-0 h-full relative overflow-hidden">
          <img src={imgs[index]} alt={title} className="h-full w-full object-cover rounded-l-lg" />

          {imgs.length > 1 && (
            <>
              <button aria-label="prev" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button aria-label="next" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          <SaveToTripPopover stay={stay} onSaved={handleSaved}>
            <button 
              className="absolute right-3 top-3 bg-white rounded-full p-2 shadow hover:scale-110 transition-transform cursor-pointer"
              aria-label="Save to trip"
            >
              <Heart className="h-5 w-5 text-red-500 fill-transparent hover:fill-red-500 transition-all" />
            </button>
          </SaveToTripPopover>
        </div>

        {/* Right: content */}
        <div className="flex-1 p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <div className="text-sm text-muted-foreground mb-1">Viewed</div>
              <h3 className="text-xl font-semibold mb-1"><a href="#">{title}</a></h3>
              <p className="text-sm text-muted-foreground mb-3">{location}</p>
              <p className="text-sm text-muted-foreground mb-4">Kitchen · Breakfast included · 100% refundable</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-2">{tag}</div>
              <div className="text-lg font-semibold">{pricePerNight}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">8.0</span>
              <div className="text-sm">Very good · 5 reviews</div>
            </div>

            <a href="#" className="inline-block text-blue-600 hover:underline">View details</a>
          </div>
        </div>
      </Card>
    </>
  )
}
