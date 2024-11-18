import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '../styles/Top.module.css';
import { CustomNextArrow, CustomPrevArrow } from './CustomArrows';

import slide1 from '../assets/slide1.png';
import slide2 from '../assets/slide2.png';
import slide3 from '../assets/slide3.png';
import slide4 from '../assets/slide4.png';
import slide5 from '../assets/slide5.png';

const Top = () => {
    const settings = {
        dots: false, //dots 위치를 가로로 변경
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        adaptiveHeight: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />
    };

    return (
        <div className={styles.topContainer}>
            <Slider {...settings} className={styles.slickList}>
                <div>
                    <img src={slide1} alt="slide1" className={styles.slideImg} />
                </div>
                <div>
                    <img src={slide2} alt="slide2" className={styles.slideImg} />
                </div>
                <div>
                    <img src={slide3} alt="slide3" className={styles.slideImg} />
                </div>
                <div>
                    <img src={slide4} alt="slide4" className={styles.slideImg} />
                </div>
                <div>
                    <img src={slide5} alt="slide5" className={styles.slideImg} />
                </div>
            </Slider>
        </div>
    )
}

export default Top;