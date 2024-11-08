import React, { useState } from 'react';
import axios from 'axios';

function MbtiRecommendationComponent() {
    const [mbti, setMbti] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Flask 서버와 통신하도록 API URL 수정
    const API_URL = process.env.REACT_APP_MBTI_API_URL || 'http://localhost:8080/api/get-mbti-recommendations';

    const handleMbtiChange = (e) => {
        setMbti(e.target.value);
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(API_URL, { mbti });
            setRecommendations(response.data);
        } catch (err) {
            console.error("Error fetching MBTI recommendations", err);
            if (err.response) {
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
            <h2>MBTI 기반 애니메이션 추천 시스템</h2>
            <input
                type="text"
                value={mbti}
                onChange={handleMbtiChange}
                placeholder="MBTI를 입력하세요 (예: INFP, intp)"
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
    );
}

export default MbtiRecommendationComponent;
