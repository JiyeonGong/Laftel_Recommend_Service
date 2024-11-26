import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import modalStyles from "../styles/CustomModal.module.css";

Modal.setAppElement("#root");

const CustomModal = ({ isOpen, onClose, episodeId }) => {
    const [data, setData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (isOpen && episodeId) {
            // 애니메이션 상세 정보 로드
            fetch(`http://localhost:8080/api/get-episode-detail?id=${episodeId}`)
                .then((response) => response.json())
                .then((data) => setData(data))
                .catch((error) => console.error("Error fetching episode details: ", error));

            // 즐겨찾기 상태 확인
            const user = localStorage.getItem("user");
            if (user) {
                const userId = JSON.parse(user).kakaoId;
                fetch(`${process.env.REACT_APP_BACKEND_URI}/storage/check?userId=${userId}&episodeId=${episodeId}`)
                    .then((response) => response.json())
                    .then((result) => setIsFavorite(result.isFavorite))
                    .catch((error) => console.error("Error checking favorite status: ", error));
            }
        }
    }, [isOpen, episodeId]);

    const toggleFavorite = async () => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("로그인 후 이용해주세요.");
            return;
        }

        const userId = JSON.parse(user).kakaoId;
        const url = isFavorite
            ? "http://localhost:8080/storage/remove"
            : "http://localhost:8080/storage/add";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, episodeId, status: "즐겨찾기" }),
            });

            if (response.ok) {
                setIsFavorite(!isFavorite);
            } else {
                alert("즐겨찾기 상태 변경에 실패했습니다.");
            }
        } catch (error) {
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    if (!data) return null;
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
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
                {/* 닫기 버튼 */}
                <button onClick={onClose} className={modalStyles.closeButton}>
                    <svg
                        viewBox="0 -960 960 960"
                        height="22px" width="22px"
                        fill="#D7D7D7"
                        className={modalStyles.closeIcon}
                    >
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                </button>

                <div className={modalStyles.modalContent}>
                    {data.img_url && (
                        <img
                            src={data.img_url}
                            alt={data.name}
                            className={modalStyles.modalImage}
                        />
                    )}
                    <h2>{data.name}</h2>
                    <p className={modalStyles.infoTitle}>줄거리</p>
                    <p className={modalStyles.infoText}>{data.content}</p>
                    <p className={modalStyles.infoTitle}>방영분기</p>
                    <p className={modalStyles.infoText}>{data.air_year_quarter}</p>
                    <p className={modalStyles.infoTitle}>장르</p>
                    {data.genre && data.genre.length > 0 && (
                        <p className={modalStyles.infoText}>{data.genre.join(", ")}</p>
                    )}
                    <p className={modalStyles.infoTitle}>태그</p>
                    {data.tags && data.tags.length > 0 && (
                        <p className={modalStyles.infoText}>#{data.tags.join(" #")}</p>
                    )}

                    <button onClick={toggleFavorite} className={modalStyles.heartBtn}>
                        <svg viewBox="0 -960 960 960" className={modalStyles.heartIcon}>
                            {isFavorite ? (
                                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                            ) : (
                                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                            )}
                        </svg>
                    </button>
                </div>
            </motion.div>
        </Modal>
    );
};

export default CustomModal;