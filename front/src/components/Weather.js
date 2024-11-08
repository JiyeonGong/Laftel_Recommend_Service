import React, { useState } from 'react';
import axios from 'axios';

function WeatherRecommendationComponent() {
    const [city, setCity] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Flask 서버와 통신하도록 API URL 수정
    const API_URL = process.env.REACT_APP_WEATHER_API_URL || 'http://localhost:8080/api/get-weather-recommendations';


    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
    };

    const isValidInput = () => {
        return city.trim() !== "" && apiKey.trim() !== "";
    };

    const fetchWeatherRecommendations = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(API_URL, { city, api_key: apiKey });
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
            <input
                type="text"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="OpenWeatherMap API 키를 입력하세요"
                style={{ margin: '10px 0', padding: '10px', width: '300px' }}
            />
            <button onClick={fetchWeatherRecommendations} disabled={loading || !isValidInput()}>
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

export default WeatherRecommendationComponent;
