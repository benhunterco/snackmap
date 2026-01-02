import dynamic from 'next/dynamic';
import { getSnacks } from '@data/snacks'
import { useState, useEffect } from 'react';


const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false
});

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

const Map = (props) => {
  const [hdrSupport, setHdrSupport] = useState(false);
  useEffect(() => {
    setHdrSupport(window.matchMedia('(dynamic-range: high)').matches)
  })
  const snacks = getSnacks(hdrSupport)
  props= {snacks:snacks,...props}
  return (
    <div style={{ width: '100%' }}>
      <DynamicMap {...props} />
    </div>
  )
}

export default Map;