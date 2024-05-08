import React from 'react'
import styles from '../../Style/DevicesLoader.module.css'

function DevicesLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
      <div className={styles.loader}></div>
      <div className={styles.loader}></div>
    </div>
  )
}

export default DevicesLoader