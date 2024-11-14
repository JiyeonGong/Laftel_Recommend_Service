import React from 'react';
import Header from '../components/Header';
import Top from '../components/Top';
import Weather from '../components/Weather';
import Mbti from '../components/Mbti';
import Login from '../components/Login'
import titleLogo from "../assets/titleLogo.png"
import styles from '../styles/Main.module.css'; //Main css 파일

const Main = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.logoContainer}>
                <img src={titleLogo} alt="titleLogo" className={styles.logo} />
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.headerContainer}>
                    <Header />
                </div>
                <div className="info-section">
                    <Top />
                    <Weather />
                    <Mbti />
                </div>
            </div>
            <Login/>
        </div>
    );
};

export default Main;
