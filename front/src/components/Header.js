import React, { useContext } from 'react';
import styles from '../styles/Header.module.css';
import { AuthContext } from "../api/AuthContext";

import profileLogo from "../assets/logo.png"

const Header = () => {
    const API_KEY = process.env.REACT_APP_API_KEY; // REST API KEY
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI; // Redirect URI
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerBarContainer}>
                <svg
                    viewBox="0 0 200 1300"
                    className={styles.headerBar}
                >
                    <rect width="100%" height="100%" rx="40" ry="40" fill="white"/>
                    <circle cx="50" cy="50" r="8" fill="#FF605C"/>
                    <circle cx="78" cy="50" r="8" fill="#FFBD44"/>
                    <circle cx="106" cy="50" r="8" fill="#00CA4E"/>
                </svg>

                <img src={profileLogo} alt="profileLogo" className={styles.profileLogo} />
                <div className={styles.homeIcon}>
                    <svg
                        viewBox="0 -960 960 960"
                    >
                        <title>홈 이동</title>
                        <path d="M240-200h147.69v-235.38h184.62V-200H720v-360L480-741.54 240-560v360Zm-40 40v-420l280-211.54L760-580v420H532.31v-235.38H427.69V-160H200Zm280-310.77Z"/>
                    </svg>
                </div>
                <svg
                    viewBox="0 -960 960 960"
                    className={styles.searchIcon}
                >
                    <title>다른 사용자 검색</title> /* 툴팁 */
                    <path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
                <svg
                    viewBox="0 -960 960 960"
                    className={styles.storageIcon}
                >
                    <title>애니메이션 보관함</title>
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/>
                </svg>
                <svg
                    viewBox="0 -960 960 960"
                    className={styles.helpIcon}
                >
                    <title>문의</title>
                    <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                </svg>
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
                    >
                        <title>로그아웃</title>
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                    </svg>
                )}
            </div>
        </div>
    )
}

export default Header;