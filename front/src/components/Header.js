import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from "axios";
import { AuthContext } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from '../styles/Header.module.css';
import profileImage from '../assets/profileImage.svg';

const Header = () => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [scrollY, setScrollY] = useState(0);
    const [error, setError] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const toastTimeoutRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleStorageBtnClick = () => {
        if (isLoggedIn) {
            navigate("/storage");
        } else {
            alert("로그인 후 이용해주세요.");
            return;
        }
    };

    const handleHelpBtnClick = async () => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("로그인 후 이용해주세요.");
            return;
        }
        const kakaoId = JSON.parse(user).kakaoId;
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/user/profile/${kakaoId}`);
            console.log(response);

            if (response.data.role === 'ADMIN') {
                navigate('/help/admin');
            } else if (response.data.role === 'USER') {
                navigate('/help/user');
            } else {
                alert("잘못된 사용자 정보입니다. 관리자에게 문의하세요!");
                return;
            }
        } catch (error) {
            console.error("사용자 정보 조회 실패:", error.response?.data || error.message);
        }
    }

    const showToast = (message) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        setToastVisible(false);
        setTimeout(() => {
            setToastVisible(true);
            toastTimeoutRef.current = setTimeout(() => {
                setToastVisible(false);
            }, 2500);
        });
    };

    return (
        <motion.header
              className={styles.header}
              animate={{
                y: scrollY * 0.83,
              }}
              transition={{
                type: "spring",
                stiffness: 30,
              }}
        >
            <div className={styles.headerContainer}>
                <div className={styles.headerBarContainer}>
                    <svg viewBox="0 0 200 1300" className={styles.headerBar}>
                        <rect width="100%" height="100%" rx="40" ry="40" fill="white"/>
                        <circle cx="50" cy="50" r="8" fill="#FF605C"/>
                        <circle cx="78" cy="50" r="8" fill="#FFBD44"/>
                        <circle cx="106" cy="50" r="8" fill="#00CA4E"/>
                    </svg>

                    {isLoggedIn && (
                        <>
                            <img src={profileImage} alt="User Profile" className={styles.profileImage}/>
                            <div className={styles.thinLine}></div>
                        </>
                    )}

                    {/* 홈 버튼 */}
                    <button
                        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' })}}
                        className={`${styles.button} ${styles.homeBtn}`}
                    >
                        <svg className={styles.homeBtnBg} width="40" height="40" viewBox="0 0 92 92" fill="none">
                            <rect width="92" height="92" rx="30" fill="#101010"/>
                        </svg>
                        <svg height="22px" viewBox="0 -960 960 960" width="20px" fill="#DFDFDF" style={{ marginTop: "0px", position: "absolute" }}>
                            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                        </svg>
                    </button>

                    {/* 보관함 버튼 */}
                    <button onClick={handleStorageBtnClick} className={styles.button}>
                        <svg viewBox="0 -960 960 960" className={styles.storageIcon}
                        >
                            <title>애니메이션 보관함</title>
                            <path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/>
                        </svg>
                    </button>

                    {/* 문의 버튼 */}
                    <button onClick={handleHelpBtnClick} className={styles.button}>
                        <svg viewBox="0 -960 960 960" className={styles.helpIcon}
                        >
                            <title>문의</title>
                            <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                        </svg>
                    </button>

                    {!isLoggedIn ? (
                        <svg
                            viewBox="0 -960 960 960"
                            className={styles.log_in_out}
                            onClick={() => window.location.href = kakaoURL}
                        >
                            <title>로그인</title>
                            <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 -960 960 960"
                            className={styles.log_in_out}
                            onClick={() => {
                                logout();
                                showToast();
                            }}
                        >
                            <title>로그아웃</title>
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                        </svg>
                    )}
                    {toastVisible && (
                        <div className={styles.toast}>
                            로그아웃 했습니다.
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    )
}

export default Header;