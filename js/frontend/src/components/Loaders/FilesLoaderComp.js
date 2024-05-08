import React from 'react';
import styles from '../../Style/FilesLoader.module.css';

const FilesLoader = ({ size, style }) => {
  const loaderStyle = {
    ...style,
    width: size,
    height: size,
  };

  return (
    <div className={styles.container} style={{ ...loaderStyle }}>
      <div className={styles.folder}>
        <div className={styles.top}></div>
        <div className={styles.bottom}></div>
      </div>
      <div className={styles.title}>getting files...</div>
    </div>
  );
};

export default FilesLoader;
