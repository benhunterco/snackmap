import { getSnacks } from '@data/snacks'
import { useState, useEffect } from 'react';
import DynamicMap from './DynamicMap';

const Map = () => {
  const [hdrSupport, setHdrSupport] = useState(false);
  useEffect(() => {
    setHdrSupport(window.matchMedia('(dynamic-range: high)').matches)
  })
  const snacks = getSnacks(hdrSupport)
  
  return (
    <div style={{ width: '100%' }}>
      <DynamicMap snacks={snacks} />
    </div>
  )
}

export default Map;