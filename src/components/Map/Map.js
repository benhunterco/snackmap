import dynamic from 'next/dynamic';
import { getSnacks } from '@data/snacks'
import { useState, useEffect } from 'react';


const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false
});

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