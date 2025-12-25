import Head from 'next/head';

import Layout from '@components/Layout';
import { SNACKS } from '@data/snacks'
import Gallery from '@components/Gallery'; // Import your new component


const DEFAULT_CENTER = [38.907132, -77.036546]

export default function GalleryPage() {
  return (
    <Layout>
      <Head>
        <title>Streetsnacks Gallery</title>
        <meta name="description" content="The flavors of the world, at your feet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
         <Gallery snacks={SNACKS} />
    </Layout>
  )
}
