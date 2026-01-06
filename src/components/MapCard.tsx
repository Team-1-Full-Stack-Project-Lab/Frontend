import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default icon not showing
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

type Props = {
  latitude?: number
  longitude?: number
  place?: string | null
}

export default function MapCard({ latitude, longitude, place }: Props) {
  if (!latitude || !longitude) {
    return (
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="h-40 w-full flex items-center justify-center bg-muted">
          <p className="text-sm text-muted-foreground">Map data not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden z-0">
      <div className="h-40 w-full bg-muted">
        <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            <Popup>{place || 'Location'}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="p-3 text-center">
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View on OpenStreetMap
        </a>
      </div>
    </div>
  )
}
