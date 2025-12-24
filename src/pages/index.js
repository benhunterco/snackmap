import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import { SNACKS } from '@data/snacks'
import Map from '@components/Map'
import styles from '@styles/Home.module.scss';


const DEFAULT_CENTER = [38.907132, -77.036546]

export default function Home() {
  console.log(SNACKS)
  return (
    <Layout>
      <Head>
        <title>Streetsnacks SnackMap™️</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          {/* <h1 className={styles.title}>
            Next.js Leaflet Starter
          </h1> */}

          <Map className={styles.homeMap}  center={DEFAULT_CENTER} zoom={12} snacks={SNACKS}>

          </Map>
        </Container>
      </Section>
    </Layout>
  )
}
