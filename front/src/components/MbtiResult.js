import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Modal from 'react-modal';
import styles from '../styles/MbtiResult.module.css';

const MbtiResult = ({ mbti, recommendations, error, loading, handleSearch }) => {

    {/*Modal 설정(useState) - episode 정보 불러오기*/}
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const openModal = (episodeId) => {
        // SpringBoot 엔드포인트를 호출하여 상세 정보를 가져옴
        fetch(`http://localhost:8080/api/get-episode-detail?id=${episodeId}`)
            .then(response => response.json())
            .then(data => {
                setSelectedEpisode(data);
                console.log(data);
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

    {/* 추천 시스템 설정*/}
    if (loading) return <div>로딩 중 ..</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    const rectPositions = [
        { x: 36, y: 88, width: 150, height: 194 },
        { x: 193, y: 88, width: 150, height: 194 },
        { x: 350, y: 88, width: 150, height: 194 },
        { x: 507, y: 88, width: 150, height: 194 },
        { x: 664, y: 88, width: 150, height: 194 },
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
                                        x="-60"
                                        y="0"
                                        width="30%"
                                        height="63%"
                                    />
                                </pattern>
                            ))}
                        </defs>

                        {/* 하얀색 배경 */}
                        <path opacity="0.8" d="M0 20C0 8.9543 8.95431 0 20 0H880C891.046 0 900 8.95431 900 20V360C900 371.046 891.046 380 880 380H20C8.9543 380 0 371.046 0 360V20Z" fill="white"/>

                        {/* 리스트 형태의 결과 값 */}
                        {rectPositions.map((rect, index) => (
                            <g key={index} onClick={() => openModal(recommendations[index]?.id)}> {/* id로 에피소드 선택 */}
                                <rect
                                    x={rect.x}
                                    y={rect.y}
                                    width={rect.width}
                                    height={rect.height}
                                    rx="10"
                                    fill={recommendations[index]?.img_url ? `url(#mbti-pattern-${index})` : "white"}
                                />
                                {recommendations[index] && (
                                    <foreignObject
                                        x={rect.x}
                                        y={rect.y + 193}
                                        width={rect.width}
                                        height={rect.height - 20}
                                    >
                                        <div
                                            style={{
                                                fontSize: "12px", fontFamily: "Gothic A1, sans-serif",
                                                display: "flex", flexDirection: "column",
                                                alignItems: "center"
                                            }}
                                        >
                                            <p style={{ fontWeight: "bold", lineHeight: "1.4", letterSpacing: "0.1px" }}>{recommendations[index].name}</p>
                                            <div style={{display: "flex", alignItems: "center", fontWeight: "bold"}}>
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="#FFD700"
                                                    width="15px"
                                                    height="15px"
                                                    style={{ marginRight: "5px" }}
                                                >
                                                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.165L12 18.896l-7.334 3.861 1.4-8.165L.132 9.21l8.2-1.192z"/>
                                                </svg>
                                                <p style={{ margin: "0" }}>{recommendations[index].avg_rating}</p>
                                            </div>
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        ))}

                        {/* retry 버튼 */}
                        <circle
                            cx="850"
                            cy="186"
                            r="15"
                            fill="#F5F4F4"
                            onClick={() => handleSearch(mbti)}
                            className={styles.retryBtn}
                        />
                        <path
                            d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"
                            fill="#5c5c5c"
                            transform="translate(841, 194.5) scale(0.018)"
                            pointerEvents="none"
                        />

                        <text
                            x="325" y="51"
                            fontSize="19" fontWeight="600" fill="#672FDE" letterSpacing="0.5"
                            fontFamily="Gumi Romance TTF, sans-serif"
                        >
                            {mbti}
                        </text>
                        <text
                            x="383" y="50"
                            fontSize="17" fontWeight="500" fill="black"
                            fontFamily="Gumi Romance TTF, sans-serif"
                        >
                            라면 놓칠 수 없는 애니메이션
                        </text>
                    </svg>
                </motion.div>
            </AnimatePresence>

            {/* 모달 컴포넌트 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Episode Detail"
                className={styles.modal}            // CSS 모듈의 스타일 적용
                overlayClassName={styles.overlay}    // CSS 모듈의 오버레이 스타일 적용
            >
                {selectedEpisode && (
                    <div className={styles.modalContent}>
                        {/* X 버튼 */}
                        <button onClick={closeModal} className={styles.closeButton}>X</button>

                        {/* 이미지 추가 - CSS 모듈 스타일 적용 */}
                        {selectedEpisode.img_url && (
                            <img
                                src={selectedEpisode.img_url}
                                alt={selectedEpisode.name}
                                className={styles.modalImage} // CSS 모듈의 이미지 스타일 적용
                            />
                        )}

                        {/* 에피소드 상세 정보 */}
                        <h2>{selectedEpisode.name}</h2>
                        <p>{selectedEpisode.content}</p>
                        <h3>평점: {selectedEpisode.avg_rating}</h3>
                        <h3>방영 분기</h3>
                        <p>{selectedEpisode.air_year_quarter}</p>

                        <h3>장르</h3>
                        {/* 장르 표시 */}
                        {selectedEpisode.genre && selectedEpisode.genre.length > 0 && (
                            <p>{selectedEpisode.genre.join(", ")}</p>
                        )}
                        <h3>태그</h3>
                        {/* 태그 표시 */}
                        {selectedEpisode.tags && selectedEpisode.tags.length > 0 && (
                            <p>{selectedEpisode.tags.join(", ")}</p>
                        )}
                    </div>
                )}
            </Modal>

        </>
    );
};

export default MbtiResult;
