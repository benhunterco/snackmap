import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map'
import styles from '@styles/Home.module.scss';


const DEFAULT_CENTER = [40, -90]

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
          {/* center={DEFAULT_CENTER} */}
          <Map className={styles.homeMap}>
          </Map>
        </Container>
      </Section>
    </Layout>
  )
}
