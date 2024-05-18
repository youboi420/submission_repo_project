import React from 'react'
import styles from '../../Style/BinaryLoaderStyles.module.css'
function BinaryLoader() {
  return (
    <div className={`${styles.loader} ${styles.JS_on}`}>
      <span className={styles.binary}></span>
      <span className={styles.binary}></span>
    </div>
  )
}

export default BinaryLoader