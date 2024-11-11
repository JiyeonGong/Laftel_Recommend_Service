import React from 'react'
import styles from '../styles/Top.module.css';

import example from "../pages/assets/example.png"
import slideImg from "../pages/assets/slider.png"

const Top = () => {
    return (
        <div className={styles.topContainer}>
            <img src={slideImg} alt="slideImg" className={styles.slideImg}/>
        </div>
    )
}

export default Top;