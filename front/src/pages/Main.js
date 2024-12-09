import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from '../components/Header';
import Top from '../components/Top';
import Weather from '../components/Weather';
import Mbti from '../components/Mbti';
import Footer from '../components/Footer';
import MbtiResult from '../components/MbtiResult';
import TeruTeru from '../components/TeruTeru';
import titleLogo from "../assets/titleLogo.png";
import styles from '../styles/Main.module.css';

const Main = () => {
    const [mbti, setMbti] = useState('ENFP');
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (mbti) => {
        const scrollPosition = window.scrollY;
        setRecommendations([]);

        try {
            const API_URL = process.env.REACT_APP_MBTI_API_URL || 'http://localhost:5001/api/mbti_recommendations';
            const response = await axios.post(API_URL, { mbti });
            setRecommendations(response.data);
        } catch (err) {
            console.error("Error fetching MBTI recommendations", err);
        } finally {
            setTimeout(() => {
                window.scrollTo(0, scrollPosition); // DOM 업데이트 후 스크롤 복구
            }, 0);
        }
    };

    useEffect(() => {
        handleSearch(mbti);
    }, [mbti]);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.logoContainer}>
                <img src={titleLogo} alt="titleLogo" className={styles.logo} onClick={() => navigate("/")}/>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.headerContainer}>
                    <Header />
                </div>
                <div className={styles.infoContainer}>
                    <Top />
                    <div className={styles.secondSection}>
                        <Mbti
                            setMbti={setMbti}
                            handleSearch={handleSearch}
                        />
                        <TeruTeru />
                    </div>
                    <div className={styles.thirdSection}>
                        <MbtiResult
                            mbti={mbti}
                            recommendations={recommendations.length > 0 ? recommendations : []}
                            handleSearch={handleSearch}
                        />
                    </div>
                    <div className={styles.fourthSection}>
                        <Weather />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Main;
