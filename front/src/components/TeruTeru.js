import React, { useState } from 'react';
import styles from '../styles/TeruTeru.module.css';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

import chatImg from '../assets/chatImg.png';

const TeruTeru = () => {
    const navigate = useNavigate();
    const handleBtn = () => {
        navigate("/chat/teruteru");
    }

    return (
        <div className={styles.teruteruContainer}>
            <svg width="215" height="270" viewBox="0 0 401 504" fill="none" className={styles.TeruTeruComponent}>
                <path d="M0 38C0 17.0132 17.0132 0 38 0H363C383.987 0 401 17.0132 401 38V466C401 486.987 383.987 504 363 504H38C17.0132 504 0 486.987 0 466V38Z" fill="#FEFEFE"/>
                <path
                    d="M145.5 424.989C145.5 413.121 155.121 403.5 166.989 403.5H227.884C240.375 403.5 250.5 413.625 250.5 426.116C250.5 436.821 241.821 445.5 231.116 445.5H166.011C154.683 445.5 145.5 436.317 145.5 424.989Z"
                    fill="#E0EDE5"
                    className={styles.moveBtn}
                    onClick={handleBtn}
                />
                <image href={chatImg} x="105" y="50" width="190" height="190" />
                <text fontSize="25" fill="#616060" fontWeight="600" textAnchor="middle">
                    <tspan x="200" dy="300">테루테루에게</tspan>
                    <tspan x="195" dy="42">추천받기</tspan>
                </text>
                <text
                    x="190" y="433"
                    fontSize="20.5" fill="#308452" fontWeight="700"
                    textAnchor="middle"
                    pointerEvents="none"
                >
                    이동
                </text>
            </svg>
            <svg height="10px" viewBox="0 -960 960 960" width="19px" fill="#308452" className={styles.arrowIcon}>
                <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
            </svg>
        </div>
    )
}

export default TeruTeru;