import { Link } from 'react-router-dom';

import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>


          Streetsnacks
          <span className={styles.headerLinks}>

            <Link to="/">
              Map
            </Link>
            <Link to="/gallery">
              Gallery
            </Link>
          </span>
        </p>
      </Container>
    </header>
  );
};

export default Header;
