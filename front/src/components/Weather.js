import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import styles from '../styles/Weather.module.css';
import axios from 'axios';

const Weather = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [cityName, setCityName] = useState("");

    const API_URL = process.env.REACT_APP_WEATHER_API_URL || 'http://localhost:8080/api/get-weather-recommendations';
    const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

    const weatherTexts = {
        맑음: ["햇살", " 가득한 날, 이 애니메이션과 함께!"],
        구름: ["구름", "이 많은 날엔 마음이 따뜻해지는 이야기를!"],
        눈: ["겨울", " 감성 가득한 이 작품 어떠세요?"],
        비: ["비", "와 어울리는 잔잔한 애니메이션은 어때요?"],
    };
    const weatherText = weatherTexts[currentWeather] || "날씨에 맞는 작품을 추천드릴게요!";

    const rectPositions = [
        { x: 310, y: 92, width: 162, height: 210 },
        { x: 482, y: 92, width: 162, height: 210 },
        { x: 654, y: 92, width: 162, height: 210 },
    ];

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
        setRecommendations([]);
        setCurrentWeather(null);
        setCityName("");

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
        <div className={styles.weatherContainer}>
            <svg width="900" height="381" viewBox="0 0 900 381" fill="none">
                <path d="M272 20C272 8.95431 280.954 0 292 0H880C891.046 0 900 8.95431 900 20V361C900 372.046 891.046 381 880 381H292C280.954 381 272 372.046 272 361V20Z" fill="white"/>
                <path d="M0 20C0 8.95431 8.95431 0 20 0H258C269.046 0 278 8.95431 278 20V190.5V361C278 372.046 269.046 381 258 381H20C8.95431 381 0 372.046 0 361V20Z" fill="white"/>
                <path d="M275 42L275 340" stroke="#E4E4E4" strokeDasharray="13 15"/>

                <defs>
                    {recommendations.map((rec, index) => (
                        <pattern
                            key={index}
                            id={`weather-pattern-${index}`}
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

                {rectPositions.map((rect, index) => (
                    <g key={index} className={styles.aniImageBtn}>
                        <motion.rect
                            x={rect.x}
                            y={rect.y}
                            width={rect.width}
                            height={rect.height}
                            rx="10"
                            fill={`url(#weather-pattern-${index})`}
                            initial={{ scale: 1 }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.3, ease: "easeInOut" },
                            }}
                        />
                        {recommendations[index] && (
                            <foreignObject
                                x={rect.x}
                                y={rect.y + 215}
                                width={rect.width}
                                height={rect.height - 20}
                            >
                                <p className={styles.aniTitle}>{recommendations[index].name}</p>
                            </foreignObject>
                        )}
                    </g>
                ))}

                {/* retry 버튼 */}
                <circle cx="858" cy="195" r="15" fill="#F5F4F4"
                    className={styles.retryBtn}
                    onClick={() => getUserLocation()}
                >
                    <title>새로 검색</title>
                </circle>
                <path
                    d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"
                    fill="#5c5c5c"
                    transform="translate(849.5, 203.5) scale(0.018)"
                    pointerEvents="none"
                />

                {/* 날씨 아이콘 */}
                <svg
                    x="58"
                    y="105"
                    width="165px"
                    height="165px"
                    viewBox="0 0 64 64"
                >
                    <defs>
                        <linearGradient id="a" x1="26.75" y1="22.91" x2="37.25" y2="41.09" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#fbbf24" />
                            <stop offset="0.45" stopColor="#fbbf24" />
                            <stop offset="1" stopColor="#f59e0b" />
                        </linearGradient>
                    </defs>
                    <circle cx="32" cy="32" r="10.5" stroke="#FFBE4F" strokeMiterlimit="50" strokeWidth="0.3" fill="url(#a)" />
                    <path
                        d="M32,15.71V9.5m0,45V48.29M43.52,20.48l4.39-4.39M16.09,47.91l4.39-4.39m0-23-4.39-4.39M47.91,47.91l-4.39-4.39M15.71,32H9.5m45,0H48.29"
                        fill="none"
                        stroke="#fbbf24"
                        strokeLinecap="round"
                        strokeMiterlimit="5"
                        strokeWidth="3"
                    >
                        <animateTransform
                            attributeName="transform"
                            dur="45s"
                            values="0 32 32; 360 32 32"
                            repeatCount="indefinite"
                            type="rotate"
                        />
                    </path>
                </svg>
                <rect x="855.655" y="200.803" width="14.2915" height="14.2438" rx="7.12192" fill="url(#pattern1_259_219)"/>

                <text
                    fontSize="17" fontWeight="500" fill="black" letterSpacing="0.5"
                    fontFamily="Gumi Romance TTF, sans-serif"
                >
                    <tspan x="82" dy="55" fill="#3D65E7"> 날씨</tspan>
                    에 딱 맞는
                    <tspan x="63" dy="1.65em">작품을 추천할게요!</tspan>
                </text>

                <text
                    x="70" y="303"
                    fontSize="17" fontWeight="500" fill="black"
                    fontFamily="Gumi Romance TTF, sans-serif"
                >
                    지금
                    <tspan fill="#7B7B7B"> {cityName}</tspan>
                    은
                    <tspan fill="#5BC733"> {currentWeather} </tspan>
                </text>

                <text
                    x="95" y="330"
                    fontSize="12" fontWeight="400" fill="#ABABAB"
                    fontFamily="Gumi Romance TTF, sans-serif"
                >
                    (현재 시각 기준)
                </text>

                <text
                    x="310" y="55"
                    fontSize="17" fontWeight="500" fill="black" letterSpacing="0.5"
                    fontFamily="Gumi Romance TTF, sans-serif"
                >
                    <tspan fill="#5BC733">{weatherText[0]}</tspan>
                    <tspan>{weatherText[1]}</tspan>
                </text>
            </svg>
        </div>

        <div>
            <div className={styles.weatherCont}>
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
