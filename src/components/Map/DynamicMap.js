import { useEffect, useState } from 'react'; // Added useState
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

import styles from './Map.module.scss';

const { MapContainer, TileLayer, Marker, Popup } = ReactLeaflet;

const Map = ({ className, snacks = [], ...rest }) => {
  const [activeSnack, setActiveSnack] = useState(null); // State for modal

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
      <MapContainer className={mapClassName} {...rest}>
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
              <Popup>
                <div style={{ width: '400px' }}>
                  {/* Clickable Image */}
                  <img
                    src={snack.image}
                    alt={snack.name}
                    className={styles.popupImage}
                    onClick={() => setActiveSnack(snack)}
                  />
                  <h3 style={{ margin: '8px 0 5px' }}>{snack.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{snack.date}</p>
                  <p style={{ margin: '8px 0 0', fontSize: '14px' }}>{snack.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Fullscreen Modal Overlay */}
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