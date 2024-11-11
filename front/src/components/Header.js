import React from 'react'
import styles from '../styles/Header.module.css';

import headerBar from "../pages/assets/headerBar.png"
import green from "../pages/assets/green.png"
import helpBtn from "../pages/assets/help2.png"
import homeBtn from "../pages/assets/home.png"
import logInBtn from "../pages/assets/log-in.png"
import profileLogo from "../pages/assets/logo.png"
import profileImg from "../pages/assets/profile.png"
import red from "../pages/assets/red.png"
import yellow from "../pages/assets/yellow.png"
import searchBtn from "../pages/assets/search.png"
import storageBtn from "../pages/assets/archive1.png"

const Header = () => {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerBarContainer}>
                <img src={headerBar} alt="headerBar" className={styles.headerBar} />

                <img src={red} alt="redIcon" className={styles.redIcon} />
                <img src={yellow} alt="yellowIcon" className={styles.yellowIcon} />
                <img src={green} alt="greenIcon" className={styles.greenIcon} />

                <img src={profileLogo} alt="profileLogo" className={styles.profileLogo} />
                <img src={homeBtn} alt="homeBtn" className={styles.homeBtn} />
                <img src={searchBtn} alt="searchBtn" className={styles.searchBtn} />
                <img src={storageBtn} alt="storageBtn" className={styles.storageBtn} />
                <img src={helpBtn} alt="helpBtn" className={styles.helpBtn} />
            </div>
        </div>
    )
}

export default Header;