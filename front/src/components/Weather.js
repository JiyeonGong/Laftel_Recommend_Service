import React, { useState } from 'react';
import axios from 'axios';

function WeatherComponent() {
    const [city, setCity] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_URL = process.env.REACT_APP_WEATHER_API_URL || 'http://localhost:8080/api/get-weather-recommendations';
    const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const fetchWeatherRecommendations = async () => {
        if (!OPENWEATHER_API_KEY) {
            setError("API 키가 설정되지 않았습니다. 관리자에게 문의하세요.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.post(API_URL, { city, api_key: OPENWEATHER_API_KEY });
            setRecommendations(response.data);
        } catch (err) {
            console.error("Error fetching weather recommendations", err);
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
            <h2>날씨 기반 애니메이션 추천 시스템</h2>
            <input
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="도시 이름을 입력하세요 (예: Seoul)"
                style={{ margin: '10px 0', padding: '10px', width: '300px' }}
            />
            <button onClick={fetchWeatherRecommendations} disabled={loading || !city}>
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

export default WeatherComponent;

