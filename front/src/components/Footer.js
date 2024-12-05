import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = ({ style = {} }) => {
    return (
        <footer className={styles.footer} style={{ ...style }}>
            <div className={styles.footerContent}>
                <p>© 2024 Coding Ping - TeruTeru. All rights reserved.</p>
                <p>Contact us
                    <br></br>
                    🇰🇷 miki:  gamja_da@naver.com
                    <br></br>
                    🇰🇷 sto: yuvin3493@gmail.com</p>
            </div>
        </footer>
    );
};

export default Footer;
