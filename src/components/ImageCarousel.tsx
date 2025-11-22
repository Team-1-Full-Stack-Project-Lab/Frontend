import { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import type { StayImageResponse } from '@/types/stays'

type Props = {
  images: StayImageResponse[]
  altText: string
  className?: string
  showIndicators?: boolean,
  onImageClick?: (index: number) => void
  initialIndex?: number
}

export function ImageCarousel({ images, altText, className = '', showIndicators = true, onImageClick }: Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!images || images.length === 0) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground text-sm">No images available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full group">
      <Carousel
        setApi={setApi}
        className={`w-full h-full ${className}`}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div
                className={`h-full w-full ${onImageClick ? 'cursor-zoom-in' : ''}`}
                onClick={() => onImageClick?.(index)}
              >
                <img
                  src={image.link}
                  alt={`${altText} - Image ${image.id}`}
                  className="w-full h-full object-cover"
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

      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${index === current
                ? 'bg-white w-6'
                : 'bg-white/60 w-1.5 hover:bg-white/80'
                }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  )
}