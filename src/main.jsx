import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MapProvider } from '@context/MapContext';
import '@styles/globals.scss';

import Home from './pages/index';
import GalleryPage from './pages/gallery';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MapProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </HashRouter>
    </MapProvider>
  </React.StrictMode>
);
