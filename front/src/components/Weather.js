import React, { useState } from 'react';
import styles from '../styles/Weather.module.css';
import axios from 'axios';

import weatherComp from '../assets/weatherComp.png';
import cloudImg from '../assets/cloud.png';

const Weather = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null); // 현재 날씨 상태
    const [cityName, setCityName] = useState(""); // 현재 도시 이름

    const API_URL = process.env.REACT_APP_WEATHER_API_URL || 'http://localhost:8080/api/get-weather-recommendations';
    const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

    const fetchWeatherRecommendations = async (latitude, longitude) => {
        if (!OPENWEATHER_API_KEY) {
            setError("API 키가 설정되지 않았습니다. 관리자에게 문의하세요.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            // 위치 정보와 API 키를 포함하여 Spring Boot 서버로 POST 요청 전송
            const response = await axios.post(API_URL, {
                latitude,
                longitude,
                api_key: OPENWEATHER_API_KEY
            });

            const { recommendations, weather, city } = response.data;

            setRecommendations(recommendations);
            setCurrentWeather(weather);
            setCityName(city);
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

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    fetchWeatherRecommendations(latitude, longitude);
                },
                (error) => {
                    console.error("Error obtaining location:", error);
                    setError("위치 정보를 가져오는 데 실패했습니다. 위치 서비스가 활성화되어 있는지 확인하세요.");
                }
            );
        } else {
            setError("이 브라우저는 위치 기반 서비스를 지원하지 않습니다.");
        }
    };

    return (
    <div>

        <div>
            <div>
                <img src={weatherComp} alt="weatherComp" className={styles.weatherCont}/>
                <img src={cloudImg} alt="cloudImg" className={styles.cloudImg}/>
            </div>
            <div className={styles.weatherContainer}>
                <h2>날씨 기반 애니메이션 추천 시스템</h2>
                <button onClick={getUserLocation} disabled={loading}>
                    {loading ? "로딩 중..." : "추천 받기"}
                </button>

                {loading && <p>추천을 가져오는 중...</p>}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {currentWeather && cityName && (
                    <p>
                        지금 <strong>{cityName}</strong>의 날씨는 <strong>{currentWeather}</strong>입니다!
                    </p>
                )}

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
    </div>
    );
};

export default Weather;
