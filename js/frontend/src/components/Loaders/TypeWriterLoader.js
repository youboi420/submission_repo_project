import React from 'react'
import styles from '../../Style/TypeWriterLoader.module.css'
function TypeWriterLoader() {
  return (
    <div className={styles.redCircle}>
    <div className={styles.typewriter}>
      <div className={styles.slide}><i></i></div>
      <div className={styles.paper}></div>
      <div className={styles.keyboard}></div>
    </div>
    </div>
  )
}

export default TypeWriterLoader