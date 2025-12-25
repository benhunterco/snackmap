import Link from 'next/link';

import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
         
          
          Streetsnacks
          <Link className={styles.headerLinks} href="/">
            SnackMap
          </Link>
          <Link className={styles.headerLinks} href="/gallery">
            Gallery
          </Link>
        </p>
      </Container>
    </header>
  );
};

export default Header;
