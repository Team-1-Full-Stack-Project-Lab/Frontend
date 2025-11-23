type Props = {
  place?: string | null
}

export default function MapCard({ place }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const mapsQuery = encodeURIComponent(place ?? '')

  const embedSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapsQuery}`
    : null

  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

  return (
    <div className="w-72 rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="h-40 w-full bg-muted">
        {place ? (
          embedSrc ? (
            <iframe
              title="map"
              src={embedSrc}
              className="w-full h-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">Map preview not available</p>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Select a location</p>
          </div>
        )}
      </div>

      <div className="p-3 text-center">
        <a
          href={place ? searchUrl : 'https://www.google.com/maps'}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View on Map
        </a>
      </div>
    </div>
  )
}
