import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StayImageResponse } from '@/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

type Props = {
  images: StayImageResponse[]
  altText: string
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export function FullscreenImageCarousel({ images, altText, isOpen, onClose, initialIndex = 0 }: Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(initialIndex)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!api) return

    if (initialIndex > 0) {
      api.scrollTo(initialIndex, true)
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api, initialIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="absolute top-4 left-4 z-50 text-white text-sm bg-black/50 px-3 py-2 rounded">
        {current + 1} / {images.length}
      </div>

      <div className="w-full h-full max-w-7xl mx-auto">
        <div className="relative w-full h-full group">
          <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent>
              {images.map(image => (
                <CarouselItem key={image.id}>
                  <div className="flex items-center justify-center h-screen p-4">
                    <img
                      src={image.link}
                      alt={`${altText} - Image ${image.id}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </Carousel>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} aria-label="Close fullscreen" />
    </div>
  )
}
