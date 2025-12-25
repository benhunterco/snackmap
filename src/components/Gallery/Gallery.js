import styles from './Gallery.module.scss';

const Gallery = ({ snacks }) => {
  if (!snacks) return null;

  return (
    <div className={styles.galleryWrapper}>
      {/* <h1 className={styles.title}>Galerie de la Cuisine du Chemin</h1> */}
      <h1 className={styles.title}>Galerie des Snack</h1>
      {/* arrange and curate by */}
      <div className={styles.grid}>
        {snacks.map((snack) => (
          <div key={snack.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img 
                src={'../' + snack.image} 
                alt={snack.name} 
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <h2 className={styles.snackName}>{snack.name}</h2>
              <p className={styles.date}>{snack.date}</p>
              {snack.description && (
                <p className={styles.description}>{snack.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;