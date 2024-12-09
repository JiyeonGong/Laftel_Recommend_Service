import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import CustomModal from '../components/CustomModal'
import styles from '../styles/MbtiResult.module.css';

const MbtiResult = ({ mbti, recommendations, handleSearch }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const openModal = (episodeId) => {
        setSelectedEpisode(episodeId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEpisode(null);
    };

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
                    <CustomModal isOpen={modalIsOpen} onClose={closeModal} episodeId={selectedEpisode} />
                )}
            </AnimatePresence>
        </>
    );
};

export default MbtiResult;