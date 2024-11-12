import React from 'react'
import Slider from "react-slick";
import styles from '../styles/Top.module.css';

import slideImg from "../pages/assets/slider.png"

const Top = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
    };

    return (
        <div className={styles.topContainer}>
            <img src={slideImg} alt="slideImg" className={styles.slideImg}/>
        </div>
    )
}

export default Top;