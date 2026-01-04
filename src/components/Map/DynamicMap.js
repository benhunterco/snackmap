import { useEffect, useState } from 'react';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.scss';
import dayjs from 'dayjs';
import { useMapContext } from '@context/MapContext'; // Import the context

const { MapContainer, TileLayer, Marker, Popup, useMapEvents } = ReactLeaflet;

const getDate = (dateStr) => {
  const dateobj = dayjs(dateStr);
  if (dateobj.isValid()) {
    return dateobj.year();
  } else {
    return 'Timeless'
  }
}

function MapStateManager() {
  const { setCenter, setZoom } = useMapContext();
  
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const center = map.getCenter();
      setCenter([center.lat, center.lng]);
    },
    zoomend: (e) => {
      const map = e.target;
      setZoom(map.getZoom());
    }
  });
  
  return null;
}

const Map = ({ className, snacks = []}) => {
  const [activeSnack, setActiveSnack] = useState(null);
  const { center, zoom } = useMapContext(); // Get state from context
  
  let mapClassName = styles.map;
  if (className) mapClassName = `${mapClassName} ${className}`;

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);
  return (
    <div className={styles.mapWrapper}>
      <MapContainer 
        className={mapClassName} 
        center={center}
        zoom={zoom}
        tap={false}
      >
        <MapStateManager /> 
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MarkerClusterGroup chunkedLoading>
          {snacks.map((snack) => (
            <Marker 
              key={snack.id} 
              position={snack.position} 
              icon={new L.divIcon({
                className: 'custom-pin-wrapper',
                html: `<div class="${styles.customPin}"><img src="${snack.image}" /></div>`,
                iconSize: [45, 45],
                iconAnchor: [22, 45],
                popupAnchor: [0, -45],
              })}
            >
              <Popup maxWidth={'auto'}>
                <div style={{ width: '70dvw', maxWidth:'325px', maxHeight: '60dvh'}}>
                  <img
                    src={snack.image}
                    alt={snack.name}
                    className={styles.popupImage}
                    onClick={() => setActiveSnack(snack)}
                  />
                  <h3 style={{ margin: '8px 0 5px' }}>{snack.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{getDate(snack.date)}</p>
                  <p style={{ margin: '8px 0 0', fontSize: '14px' }}>{snack.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {activeSnack && (
        <div className={styles.modalOverlay} onClick={() => setActiveSnack(null)}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton}>&times;</button>
            <img src={activeSnack.image} alt={activeSnack.name} />
            <div className={styles.modalCaption}>
              <h2>{activeSnack.name}</h2>
              <p>{activeSnack.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;