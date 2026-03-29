import React from 'react';
import styles from './SkeletonLoader.module.css';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array(count).fill(0);

  return (
    <div className={styles.skeleton_container}>
      {skeletons.map((_, i) => (
        <div key={i} className={`${styles.skeleton} ${styles[type]}`}>
          <div className={styles.shimmer_wrapper}>
            <div className={styles.shimmer}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
