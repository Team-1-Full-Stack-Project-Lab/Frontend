import { useState, type KeyboardEvent } from 'react'
import { X, Plus, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field'

interface ImageUrlsManagerProps {
  imageUrls: string[]
  onChange: (urls: string[]) => void
  errors?: string[]
}

export function ImageUrlsManager({ imageUrls, onChange, errors }: ImageUrlsManagerProps) {
  const [inputValue, setInputValue] = useState('')
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())

  const handleAdd = () => {
    const trimmedUrl = inputValue.trim()
    if (!trimmedUrl) return

    // Basic URL validation
    try {
      new URL(trimmedUrl)
      if (!imageUrls.includes(trimmedUrl)) {
        onChange([...imageUrls, trimmedUrl])
        setInputValue('')
      }
    } catch {
      // Invalid URL, could show error toast
      console.error('Invalid URL')
    }
  }

  const handleRemove = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    onChange(newUrls)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleImageError = (url: string) => {
    setImageLoadErrors(prev => new Set(prev).add(url))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/image.jpg"
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {errors?.map((error, index) => (
        <FieldError key={`${error}-${index}`}>{error}</FieldError>
      ))}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {imageUrls.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {imageLoadErrors.has(url) ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground break-all line-clamp-2">{url}</p>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(url)}
                  />
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {imageUrls.length === 0 && (
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No images added yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add image URLs above to see them here</p>
        </div>
      )}
    </div>
  )
}
