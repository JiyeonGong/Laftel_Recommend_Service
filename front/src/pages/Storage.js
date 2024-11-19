import React from 'react';
import { useNavigate} from "react-router-dom";
import styles from '../styles/Storage.module.css'; // 스타일을 별도의 CSS 파일로 분리하여 관리합니다.
import logo from '../assets/logo.svg'; // 로고 파일 임포트

function Storage() {
    const navigate = useNavigate();

    const handleMainButtonClick = () => {
        navigate('/Main');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.menuBar}>
                {/* 로고와 메뉴바 내용 추가 */}
                <img src={logo} alt="Logo" className={styles.logo}/>
                <h1>메뉴 영역</h1>
                <button className={styles.mainButton} onClick={handleMainButtonClick}>메인으로</button>
            </div>
            {/* 페이지의 메인 콘텐츠가 여기에 위치할 수 있습니다. */}
            <div className={styles.mainContent}>
                <p>여기에 메인 콘텐츠를 추가하세요.</p>
            </div>
        </div>
    );
}

export default Storage;
