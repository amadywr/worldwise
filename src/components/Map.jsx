import { useNavigate } from 'react-router-dom'
import styles from './Map.module.css'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { useEffect, useState } from 'react'
import { useCities } from '../contexts/CitiesContext'
import { useGeolocation } from '../hooks/useGeolocation'
import Button from '../components/Button'
import { useUrlPosition } from '../hooks/useUrlPosition'

function Map() {
  const [mapPosition, setMapPosition] = useState([-33.856987, 151.215143])
  const { cities } = useCities()

  const [mapLat, mapLng] = useUrlPosition()

  const {
    isLoading: isLoadingPosition,
    position: getlocationPosition,
    getPosition,
  } = useGeolocation()

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng])
  }, [mapLat, mapLng])

  useEffect(() => {
    if (getlocationPosition) {
      setMapPosition([getlocationPosition.lat, getlocationPosition.lng])
    }
  }, [getlocationPosition])

  return (
    <div className={styles.mapContainer}>
      {!getlocationPosition && (
        <Button type={'position'} onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={7}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap()
  map.setView(position)

  return null
}

function DetectClick() {
  const navigate = useNavigate()

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  })
}

export default Map
