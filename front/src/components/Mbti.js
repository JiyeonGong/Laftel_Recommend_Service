import React, { useState } from 'react';
import styles from '../styles/Mbti.module.css';
import axios from 'axios';

function MbtiRecommendationComponent() {
    const [mbti, setMbti] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Flask 서버와 통신하도록 API URL 수정
    const API_URL = process.env.REACT_APP_MBTI_API_URL || 'http://localhost:5001/api/mbti_recommendations';

    const handleMbtiChange = (e) => {
        setMbti(e.target.value);
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        setError("");
        setRecommendations([]);
        try {
            const response = await axios.post(API_URL, { mbti });
            setRecommendations(response.data);
        } catch (err) {
            console.error("Error fetching MBTI recommendations", err);
            if (err.response && err.response.data && err.response.data.error) {
                // 서버에서 반환된 오류 메시지를 화면에 표시
                setError(err.response.data.error);
            } else if (err.response) {
                setError(`추천을 가져오는 도중 문제가 발생했습니다: ${err.response.data.error || '서버 오류'}`);
            } else {
                setError("추천을 가져오는 도중 문제가 발생했습니다. 네트워크 오류를 확인하세요.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/*<svg
                width="1250"
                height="503"
                viewBox="0 0 1250 503"
                fill="none"
            >
                <path d="M0.5 39C0.5 17.737 17.737 0.5 39 0.5H1211C1232.26 0.5 1249.5 17.737 1249.5 39V464C1249.5 485.263 1232.26 502.5 1211 502.5H39C17.737 502.5 0.5 485.263 0.5 464V39Z" fill="#F4F6FB" stroke="#ECECF2"/>
                <g filter="url(#filter0_d_33_6)">

                    <path d="M381.767 257.285C381.767 309.357 339.734 351.569 287.883 351.569C236.033 351.569 194 309.357 194 257.285C194 205.213 236.033 163 287.883 163C339.734 163 381.767 205.213 381.767 257.285Z" fill="#425DF8"/>
                </g>
                <g filter="url(#filter1_d_33_6)">
                    <path d="M605.643 258.285C605.643 310.357 563.43 352.569 511.358 352.569C459.286 352.569 417.074 310.357 417.074 258.285C417.074 206.213 459.286 164 511.358 164C563.43 164 605.643 206.213 605.643 258.285Z" fill="#FCFCFC"/>
                </g>
            </svg>*/}

            <div className={styles.weatherContainer}>
                <h2>MBTI 기반 애니메이션 추천 시스템</h2>
                <input
                    type="text"
                    value={mbti}
                    onChange={handleMbtiChange}
                    placeholder="MBTI를 입력하세요 (예: INFP, ENTP)"
                    style={{ margin: '10px 0', padding: '10px', width: '300px' }}
                />
                <button onClick={fetchRecommendations} disabled={loading || !mbti}>
                    추천 받기
                </button>

                {loading && <p>추천을 가져오는 중...</p>}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {recommendations.length > 0 && (
                    <div>
                        <h3>추천된 애니메이션 리스트:</h3>
                        <ul>
                            {recommendations.map((anime, index) => (
                                <li key={index}>
                                    {anime.name} (평점: {anime.avg_rating})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MbtiRecommendationComponent;
