import React, { useState } from 'react';  // useState를 추가로 import합니다.
import { motion, AnimatePresence } from "framer-motion";
import Modal from 'react-modal';
import styles from '../styles/MbtiResult.module.css'; // CSS 모듈 가져오기

// 최상위 엘리먼트 설정
Modal.setAppElement('#root');

const MbtiResult = ({ mbti, recommendations, error, loading, handleSearch }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const openModal = (episodeId) => {
        // SpringBoot 엔드포인트를 호출하여 상세 정보를 가져옴
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

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                >
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
                            <g key={index} className={styles.aniImageBtn} onClick={() => openModal(recommendations[index]?.id)}>
                                <motion.rect
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
                            </g>
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
                </motion.div>
            </AnimatePresence>

            {/* 모달 컴포넌트 추가 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Episode Detail"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                {selectedEpisode && (
                    <div className={styles.modalContent}>
                        {/* X 버튼 */}
                        <button onClick={closeModal} className={styles.closeButton}>X</button>

                        {/* 에피소드 상세 정보 */}
                        {selectedEpisode.img_url && (
                            <img src={selectedEpisode.img_url} alt={selectedEpisode.name} className={styles.modalImage} />
                        )}
                        <h2>{selectedEpisode.name}</h2>
                        <p>{selectedEpisode.content}</p>
                        <p>평점: {selectedEpisode.avg_rating}</p>
                        <p>방영분기: {selectedEpisode.air_year_quarter}</p>

                        {/* 장르 표시 */}
                        {selectedEpisode.genre && selectedEpisode.genre.length > 0 && (
                            <p>장르: {selectedEpisode.genre.join(", ")}</p>
                        )}

                        {/* 태그 표시 */}
                        {selectedEpisode.tags && selectedEpisode.tags.length > 0 && (
                            <p>태그: {selectedEpisode.tags.join(", ")}</p>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default MbtiResult;
