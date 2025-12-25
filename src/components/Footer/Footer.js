import Container from '@components/Container';

import styles from './Footer.module.scss';

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      <Container className={`${styles.footerContainer} ${styles.footerLegal}`}>
        <p style={{textAlign:'center'}}>
          &copy; Streetsnacks, {new Date().getFullYear()}. The flavors of the world, at your feet.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
