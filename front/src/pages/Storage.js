import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Storage.module.css'; // 스타일을 별도의 CSS 파일로 분리하여 관리합니다.
import logo from '../assets/logo.svg'; // 로고 파일 임포트
import goToMainIcon from '../assets/GoToMain.svg'; // 메인으로 이동 버튼 이미지 임포트
import profileImage from '../assets/duck.png'; // 유저 프로필 임시 이미지 임포트
import storButtonIcon from '../assets/StorButton.svg'; // 보관함 버튼 이미지 임포트
import trashIcon from '../assets/trushIcon.svg'; // 휴지통 아이콘 임포트
import recommendImage from '../assets/recommend1.svg'; // 추천 버튼 이미지 임포트

function Storage() {
    const navigate = useNavigate();
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1000);

    {/* 인터넷 창의 크기가 1000 이하일 때 실행되는 함수 */}
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1000);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMainButtonClick = () => {
        navigate('/');
    };

    const handleRecommendButtonClick = () => {
        navigate('/chat/teruteru');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.menuBar}>
                {/* 로고와 메뉴바 내용 추가 */}
                <img
                    src={logo}
                    alt="Logo"
                    className={`${styles.logo} ${styles.centerLogo}`}
                    onClick={() => isSmallScreen && handleMainButtonClick()}
                    style={{ cursor: isSmallScreen ? 'pointer' : 'default' }}
                />
                {/* 메인으로 버튼에 커서를 올리면 색깔이 변하는 호버 추가 */}
                {!isSmallScreen && (
                    <div className={styles.goToMainWrapper}>
                        <img
                            src={goToMainIcon}
                            alt="Go to Main"
                            className={styles.mainButtonIcon}
                            onClick={handleMainButtonClick}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'invert(42%) sepia(82%) saturate(5036%) hue-rotate(232deg) brightness(102%) contrast(102%)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                        />
                    </div>
                )}
            </div>
            {/* 유저 프로필 섹션*/}
            <div className={styles.contentWrapper}>
                <div className={`${styles.profileSection} ${styles.responsiveProfile}`}>
                    {/* 추후 수정*/}
                    <h2>나의 프로필</h2>
                    <div className={styles.profileImageWrapper}>
                        <img src={profileImage} alt="User Profile" className={styles.profileImage} />
                    </div>

                    {/* 유저 닉네임 부분*/}
                    <p className={styles.userName}>Iamduck</p>
                    <div className={styles.storButtonWrapper}>
                        <button className={styles.storButton}>
                            <img src={storButtonIcon} alt="Stor Button" className={styles.storButtonIcon} />
                        </button>
                    </div>

                    {/* 추천 버튼 섹션 - StorButton 밑에 위치 */}
                    {/* 버튼 클릭시 테루테루 gpt 페이지로 이동 */}
                    <div className={styles.recommendSection}>
                        <button className={styles.recommendButton} onClick={handleRecommendButtonClick}>
                            <img src={recommendImage} alt="Recommend" className={styles.recommendImage} />
                        </button>
                    </div>
                </div>

                {/* 찜목록 섹션 */}
                <div className={styles.storageSection}>
                    <div className={styles.storageHeader}>
                        <div className={styles.tabMenu}>
                            <p className={styles.activeTab}>나의 찜 목록</p>
                        </div>
                        {/* 삭제버튼 섹션*/}
                        <button className={styles.trashButton} onClick={() => {/* TODO: 삭제 기능 추가 예정 */}}>
                            <img src={trashIcon} alt="Delete" className={styles.trashIcon}/>
                        </button>
                    </div>
                    {/* useState로 바꿔야 할 부분.. 찜목록에 작품이 담기면 숨겨져야할 부분임.*/}
                    <div className={styles.noItemsMessage}>
                        <p>아직 찜 한 작품이 없어요.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Storage;
