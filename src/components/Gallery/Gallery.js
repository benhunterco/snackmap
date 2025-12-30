import styles from './Gallery.module.scss';
import { useState, useEffect } from 'react';

const Gallery = ({ snacks }) => {
  const [imageDimensions, setImageDimensions] = useState({});

  const handleImageLoad = (e, snackId) => {
    const img = e.target;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    setImageDimensions(prev => ({
      ...prev,
      [snackId]: { aspectRatio }
    }));
  };

  if (!snacks) return null;

  return (
    <div className={styles.galleryWrapper}>
      <h1 className={styles.title}>Galerie des Snack</h1>
      <div className={styles.grid}>
        {snacks.map((snack) => {
          const dims = imageDimensions[snack.id];
          const isWide = dims && dims.aspectRatio > 1.2;
          const isTall = dims && dims.aspectRatio < 0.8;
          
          return (
            <div 
              key={snack.id} 
              // className={`${styles.card} ${isWide ? styles.cardWide : ''} ${isTall ? styles.cardTall : ''}`}
            >
              <div className={`${styles.card} ${isWide ? styles.cardWide : ''} ${isTall ? styles.cardTall : ''}`}>
                <img 
                  src={'../' + snack.image} 
                  alt={snack.name} 
                  className={styles.image}
                  onLoad={(e) => handleImageLoad(e, snack.id)}
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
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;