import React from 'react';
import styles from '../styles/Top.module.css';

export const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className={styles.nextArrow} onClick={onClick}>
            <svg
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#FFFFFF"
            >
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
            </svg>
        </div>
    );
};

export const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className={styles.prevArrow} onClick={onClick}>
            <svg
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#FFFFFF"
            >
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
            </svg>
        </div>
    );
};