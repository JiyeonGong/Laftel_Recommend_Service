import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import CustomModal from '../components/CustomModal'
import styles from '../styles/Storage.module.css'; // 스타일을 별도의 CSS 파일로 분리하여 관리합니다.
import logo from '../assets/logo.svg'; // 로고 파일 임포트
import goToMainIcon from '../assets/GoToMain.svg'; // 메인으로 이동 버튼 이미지 임포트
import profileImage from '../assets/profileImage.svg'; // 유저 프로필 임시 이미지 임포트
import storButtonIcon from '../assets/StorButton.svg'; // 보관함 버튼 이미지 임포트
import recommendImage from '../assets/recommend1.svg'; // 추천 버튼 이미지 임포트

function Storage() {
    const navigate = useNavigate();
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1000);
    const [userInfo, setUserInfo] = useState(null);
    const [episodesData, setEpisodesData] = useState([]);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [sortOption, setSortOption] = useState("addedDate");
    const [userName, setUserName] = useState("");

    const openModal = (episodeId) => {
        setSelectedEpisode(episodeId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEpisode(null);
    };

    const fetchUserInfo = async (kakaoId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/user/profile/${kakaoId}`);
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            const data = await response.json();
            setUserInfo(data);
            setUserName(data.name);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchEpisodesData = async (episodeIds) => {
        try {
            const episodeFetchPromises = episodeIds.map((id) =>
                fetch(`${process.env.REACT_APP_BACKEND_URI}/episodes/${id}`).then((res) => {
                    if (!res.ok) {
                        throw new Error(`Failed to fetch episode with id ${id}`);
                    }
                    return res.json();
                })
            );

            const episodes = await Promise.all(episodeFetchPromises);
            setEpisodesData(episodes);
            console.log(episodes);
        } catch (err) {
            setError("에피소드 데이터를 가져오는 중 오류가 발생했습니다.");
            console.error(err);
        }
    };

    const sortData = (data, criterion) => {
        switch (criterion) {
            case "addedDate":
                return [...data].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            case "name":
                return [...data].sort((a, b) => a.name.localeCompare(b.name));
            case "rating":
                return [...data].sort((a, b) => b.rating - a.rating);
            default:
                return data;
        }
    };
    const sortedEpisodes = sortData(episodesData, sortOption);

    const fetchStorageItems = async () => {
        const user = localStorage.getItem("user");
        if (!user) {
            setError("로그인 후 이용해주세요.");
            return;
        }
        const kakaoId = JSON.parse(user).kakaoId;

        fetchUserInfo(kakaoId);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/storage/list?userId=${kakaoId}&sort=addedDate,desc`);
            if (!res.ok) {
                throw new Error("데이터를 불러오는 중 문제가 발생했습니다.");
            }

            const data = await res.json();
            fetchEpisodesData(data.content.map(item => item.episodeId));
        } catch (err) {
            setError(err.message);
        }
     };

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

    useEffect(() => {
        fetchStorageItems();
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

                {!isSmallScreen && (
                    <div className={styles.goToMainWrapper}>
                        <img
                            src={goToMainIcon}
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
                    <h2>나의 프로필</h2>
                    <div className={styles.profileImageWrapper}>
                        <img src={profileImage} alt="User Profile" className={styles.profileImage} />
                    </div>

                    {/* 유저 닉네임 부분*/}
                    <p className={styles.userName}>{userName}</p>
                    <div className={styles.storButtonWrapper}>
                        <button className={styles.storButton}>
                            <img src={storButtonIcon} alt="Stor Button" className={styles.storButtonIcon} />
                        </button>
                    </div>

                    <div className={styles.recommendSection}>
                        <button className={styles.recommendButton} onClick={handleRecommendButtonClick}>
                            <img src={recommendImage} alt="Recommend" className={styles.recommendImage} />
                        </button>
                    </div>
                </div>

                {/* 찜목록 섹션 */}
                <div className={styles.storageSection}>
                    <div className={styles.storageHeader}>
                        <p className={styles.activeTab}>찜 목록</p>
                        <div className={styles.sortWrapper}>
                            <select
                                id="sort"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="addedDate">추가일 순</option>
                                <option value="name">이름 순</option>
                                <option value="rating">평점 순</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {sortedEpisodes.length > 0 ? (
                        <div className={styles.storageList}>
                            {sortedEpisodes.map((episode, index) => {
                                return (
                                    <div
                                        key={episode.episode_id || index}
                                        onClick={() => openModal(episode.episodeId)}
                                        className={styles.storageItem}
                                    >
                                        <img src={episode.imgUrl} alt={episode.name} className={styles.episodeImg} />
                                        <p>{episode.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>아직 찜 한 작품이 없어요.</p>
                    )}
                </div>
            </div>
            <AnimatePresence>
                {modalIsOpen && (
                    <CustomModal
                        isOpen={modalIsOpen}
                        onClose={closeModal}
                        episodeId={selectedEpisode}
                        fetchStorageItems={fetchStorageItems}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Storage;
