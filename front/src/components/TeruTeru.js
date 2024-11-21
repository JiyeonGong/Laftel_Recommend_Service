import React from 'react';
import styles from '../styles/TeruTeru.module.css';
import { useNavigate } from "react-router-dom";

import chatImg from '../assets/chatImg.png';

const TeruTeru = () => {
    const navigate = useNavigate();
    const handleBtn = () => {
        navigate("/chat/teruteru");
    }

    return (
        <div className={styles.teruteruContainer}>
            <svg width="219" height="270" viewBox="0 0 219 270" fill="none" className={styles.TeruTeruComponent}>
                <rect width="219" height="270" rx="20" fill="#FEFEFE"/>
                <path
                    d="M83.5 227.761C83.5 221.542 88.5419 216.5 94.7614 216.5H124.636C131.188 216.5 136.5 221.812 136.5 228.364C136.5 233.962 131.962 238.5 126.364 238.5H94.2386C88.3079 238.5 83.5 233.692 83.5 227.761Z"
                    fill="#E0EDE5"
                    className={styles.moveBtn}
                    onClick={handleBtn}
                />
                <image href={chatImg} x="60" y="30" width="100" height="100" />
                <text fontSize="13" fill="#4C4C4C" textAnchor="middle" fontFamily="Gumi Romance TTF, sans-serif">
                    <tspan x="111" dy="160">테루테루에게</tspan>
                    <tspan x="110" dy="23">추천받기</tspan>
                </text>
                <text
                    x="106" y="232"
                    fontSize="11" fill="#308452" fontWeight="700"
                    textAnchor="middle"
                    pointerEvents="none"
                >
                    이동
                </text>
            </svg>
            <svg viewBox="0 -960 960 960" pointerEvents="none" className={styles.arrowIcon}>
                <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
            </svg>
        </div>
    )
}

export default TeruTeru;