import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import { SNACKS } from '@data/snacks'
import Map from '@components/Map'
import styles from '@styles/Home.module.scss';


const DEFAULT_CENTER = [38.907132, -77.036546]

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Streetsnacks SnackMap</title>
        <meta name="description" content="The flavors of the world, at your feet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={12} snacks={SNACKS}>
          </Map>
        </Container>
      </Section>
    </Layout>
  )
}
