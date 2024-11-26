import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Modal from 'react-modal';
import styles from '../styles/MbtiResult.module.css';
import modalStyles from '../styles/AniModal.module.css';

// 최상위 엘리먼트 설정
Modal.setAppElement('#root');

const MbtiResult = ({ mbti, recommendations, error, loading, handleSearch }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const openModal = (episodeId) => {
        fetch(`http://localhost:8080/api/get-episode-detail?id=${episodeId}`)
            .then(response => response.json())
            .then(data => {
                setSelectedEpisode(data);
                setModalIsOpen(true);
            })
            .catch(error => {
                console.error("Error fetching episode details:", error);
            });
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEpisode(null);
    };

    if (loading) return <div>로딩 중 ..</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    const rectPositions = [
        { x: 30, y: 95, width: 152, height: 205 },
        { x: 192, y: 95, width: 152, height: 205 },
        { x: 354, y: 95, width: 152, height: 205 },
        { x: 516, y: 95, width: 152, height: 205 },
        { x: 678, y: 95, width: 152, height: 205 },
    ];

    const saveStorage = async (episodeId) => {
        try {
            const userId = localStorage.getItem("userId");

            //로그인이 되지 않은 상태면 로그인 안내 문구
            if (!userId) {
                alert("로그인 후 이용해주세요.");
                return;
            }

            const data = {
                userId: userId,
                episodeId: episodeId,
                status: "즐겨찾기"
            };

            const response = await fetch("http://localhost:8080/storage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Saved successfully:", result);
            } else {
                console.error("Failed to save.");
                alert("에피소드 저장에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            alert("에피소드 저장 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
        }
    };

    return (
        <>
            <AnimatePresence>
                <svg width="900" height="380" viewBox="0 0 900 380" fill="none">
                    <defs>
                        {recommendations.map((rec, index) => (
                            <pattern
                                key={index}
                                id={`mbti-pattern-${index}`}
                                patternUnits="objectBoundingBox"
                                width="1"
                                height="1"
                            >
                                <image
                                    href={rec.img_url}
                                    x="-55"
                                    y="-23"
                                    width="30%"
                                    height="63%"
                                />
                            </pattern>
                        ))}
                    </defs>

                    {/* 하얀색 배경 */}
                    <path opacity="0.8" d="M0 20C0 8.9543 8.95431 0 20 0H880C891.046 0 900 8.95431 900 20V360C900 371.046 891.046 380 880 380H20C8.9543 380 0 371.046 0 360V20Z" fill="white" />

                    {/* 리스트 형태의 결과 값 */}
                    {rectPositions.map((rect, index) => (
                        <motion.g
                            key={index}
                            className={styles.aniImageBtn}
                            onClick={() => openModal(recommendations[index]?.id)}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.3, ease: 'easeInOut' },
                            }}
                        >
                            <motion.rect
                                layoutId={`anime-thumbnail-${recommendations[index]?.id}`}
                                x={rect.x}
                                y={rect.y}
                                width={rect.width}
                                height={rect.height}
                                rx="10"
                                fill={recommendations[index]?.img_url ? `url(#mbti-pattern-${index})` : "white"}
                                initial={{ scale: 1 }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.3, ease: "easeInOut" },
                                }}
                            />
                            {recommendations[index] && (
                                <foreignObject
                                    x={rect.x}
                                    y={rect.y + 205}
                                    width={rect.width}
                                    height={rect.height - 20}
                                >
                                    <p className={styles.aniTitle}>{recommendations[index].name}</p>
                                </foreignObject>
                            )}
                        </motion.g>
                    ))}

                    {/* retry 버튼 */}
                    <circle
                        cx="863"
                        cy="186"
                        r="15"
                        fill="#F5F4F4"
                        onClick={() => handleSearch(mbti)}
                        className={styles.retryBtn}
                    >
                        <title>새로 검색</title>
                    </circle>
                    <path
                        d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"
                        fill="#5c5c5c"
                        transform="translate(854, 194.5) scale(0.018)"
                        pointerEvents="none"
                    />

                    <text
                        x="325" y="58"
                        fontSize="19" fontWeight="600" fill="#672FDE" letterSpacing="0.5"
                        fontFamily="Gumi Romance TTF, sans-serif"
                    >
                        {mbti}
                    </text>
                    <text
                        x="383" y="57"
                        fontSize="17" fontWeight="500" fill="black"
                            fontFamily="Gumi Romance TTF, sans-serif"
                        >
                        라면 놓칠 수 없는 애니메이션
                    </text>
                </svg>
            </AnimatePresence>

            <AnimatePresence>
                {modalIsOpen && (
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Episode Detail"
                        className={modalStyles.modal}
                        overlayClassName={modalStyles.overlay}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={modalStyles.modalWrapper}
                        >
                            <div className={modalStyles.modalContent}>
                                {/* X 버튼 */}
                                <button onClick={closeModal} className={modalStyles.closeButton}>X</button>

                                {selectedEpisode.img_url && (
                                    <img src={selectedEpisode.img_url} alt={selectedEpisode.name}
                                        className={modalStyles.modalImage}/>
                                )}
                                <h2>{selectedEpisode.name}</h2>
                                <p className={modalStyles.infoTitle}>줄거리</p>
                                <p className={modalStyles.infoText}>{selectedEpisode.content}</p>
                                <p className={modalStyles.infoTitle}>방영분기</p>
                                <p className={modalStyles.infoText}>{selectedEpisode.air_year_quarter}</p>
                                <p className={modalStyles.infoTitle}>장르</p>
                                {selectedEpisode.genre && selectedEpisode.genre.length > 0 && (
                                    <p className={modalStyles.infoText}>{selectedEpisode.genre.join(", ")}</p>
                                )}
                                <p className={modalStyles.infoTitle}>태그</p>
                                {selectedEpisode.tags && selectedEpisode.tags.length > 0 && (
                                    <p className={modalStyles.infoText}>#{selectedEpisode.tags.join(" #")}</p>
                                )}

                                <button onClick={() => saveStorage(selectedEpisode.id)} className={modalStyles.heartBtn}>
                                    <svg viewBox="0 -960 960 960" className={modalStyles.heartIcon}>
                                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                                    </svg>
                                </button>
                                </div>
                            </motion.div>

                    </Modal>

                )}
            </AnimatePresence>
        </>
    );
};

export default MbtiResult;
