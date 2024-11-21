import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p>© 2024 Coding Ping - TeruTeru. All rights reserved.</p>
                <p>Contact us: gamja_da@naver.com</p>
            </div>
        </footer>
    );
};

export default Footer;
