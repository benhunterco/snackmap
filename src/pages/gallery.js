import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import { SNACKS } from '@data/snacks'
import Map from '@components/Map'
import styles from '@styles/Home.module.scss';


const DEFAULT_CENTER = [38.907132, -77.036546]

export default function Gallery() {
  return (
    <Layout>
      <Head>
        <title>Streetsnacks SnackMap</title>
        <meta name="description" content="The flavors of the world, at your feet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 style={{ textAlign: 'center', margin: '1em 0' }}>Snack Gallery</h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            {SNACKS.map((snack) => (
              <div key={snack.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <img 
                  src={'../' + snack.image} 
                  alt={snack.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '15px' }}>
                  <h2 style={{ fontSize: '1.2em', margin: '0' }}>{snack.name}</h2>
                  <p style={{ color: '#666', fontSize: '0.9em' }}>{snack.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  )
}
