import '@styles/globals.scss'
import '@context/MapContext'
import { MapProvider } from '@context/MapContext'

function MyApp({ Component, pageProps }) {
  return <MapProvider>
    <Component {...pageProps} />
  </MapProvider>
}

export default MyApp
