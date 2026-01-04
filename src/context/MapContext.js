import { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export function MapProvider({ children }) {
  const [center, setCenter] = useState([40, -90]);
  const [zoom, setZoom] = useState(2);
  
  return (
    <MapContext.Provider value={{ center, zoom, setCenter, setZoom }}>
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);