import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import styles from '../styles/Weather.module.css';
import axios from 'axios';

const Weather = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentWeather, setCurrentWeather] = useState("");
    const [cityName, setCityName] = useState("");

    const API_URL = process.env.REACT_APP_WEATHER_API_URL || 'http://localhost:8080/api/get-weather-recommendations';
    const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

    useEffect(() => {
        getUserLocation();
    }, []);

    const weatherIcons = {
        '맑은 하늘': (
            <svg x="55" y="105" width="165px" height="165px" viewBox="0 0 64 64">
                <defs>
                    <filter id="sun-shadow" x="-50%" y="-50%" width="250%" height="250%">
                        <feDropShadow dx="2" dy="2" stdDeviation="7" flood-color="#FFE8CC" flood-opacity="0.95" />
                    </filter>
                    <linearGradient id="a" x1="26.75" y1="22.91" x2="37.25" y2="41.09" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#fbbf24" />
                        <stop offset="0.45" stopColor="#fbbf24" />
                        <stop offset="1" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="10.5" stroke="#FFBE4F" strokeMiterlimit="50" strokeWidth="0.3" fill="url(#a)" filter="url(#sun-shadow)"/>
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
                <rect x="855.655" y="200.803" width="14.2915" height="14.2438" rx="7.12192" fill="url(#pattern1_259_219)"/>
            </svg>
        ),
        구름: (
            <svg x="35" y="90" width="187px" height="187px" viewBox="0 0 64 64">
            	<defs>
            	    <filter id="cloud-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#9D9D9D" flood-opacity="0.25" />
                    </filter>
            		<linearGradient id="a" x1="40.76" y1="23" x2="50.83" y2="40.46" gradientUnits="userSpaceOnUse">
            			<stop offset="0" stop-color="#9ca3af"/>
            			<stop offset="0.45" stop-color="#9ca3af"/>
            			<stop offset="1" stop-color="#6b7280"/>
            		</linearGradient>
            		<linearGradient id="b" x1="22.56" y1="21.96" x2="39.2" y2="50.8" gradientUnits="userSpaceOnUse">
            			<stop offset="0" stop-color="#f3f7fe"/>
            			<stop offset="0.45" stop-color="#f3f7fe"/>
            			<stop offset="1" stop-color="#deeafb"/>
            		</linearGradient>
            	</defs>
            	<path d="M34.23,33.45a4.05,4.05,0,0,0,4.05,4H54.79a4.34,4.34,0,0,0,.81-8.61,3.52,3.52,0,0,0,.06-.66,4.06,4.06,0,0,0-6.13-3.48,6.08,6.08,0,0,0-11.25,3.19,6.34,6.34,0,0,0,.18,1.46h-.18A4.05,4.05,0,0,0,34.23,33.45Z" stroke="#848b98" stroke-miterlimit="10" stroke-width="0.5" fill="url(#a)">
            		<animateTransform attributeName="transform" type="translate" values="-2.1 0; 2.1 0; -2.1 0" dur="7s" repeatCount="indefinite"/>
            	</path>
            	<path d="M46.5,31.5l-.32,0a10.49,10.49,0,0,0-19.11-8,7,7,0,0,0-10.57,6,7.21,7.21,0,0,0,.1,1.14A7.5,7.5,0,0,0,18,45.5a4.19,4.19,0,0,0,.5,0v0h28a7,7,0,0,0,0-14Z" stroke="#e6effc" stroke-miterlimit="10" stroke-width="0.5" fill="url(#b)"
            	    filter="url(#cloud-shadow)">
            		<animateTransform attributeName="transform" type="translate" values="-3 0; 3 0; -3 0" dur="7s" repeatCount="indefinite"/>
            	</path>
            </svg>
        ),
        눈: (
            <svg x="42" y="85" width="187px" height="187px" viewBox="0 0 64 64">
            	<defs>
            		<linearGradient id="a" x1="22.56" y1="21.96" x2="39.2" y2="50.8" gradientUnits="userSpaceOnUse">
            			<stop offset="0" stop-color="#f3f7fe"/>
            			<stop offset="0.45" stop-color="#f3f7fe"/>
            			<stop offset="1" stop-color="#deeafb"/>
            		</linearGradient>
            		<linearGradient id="b" x1="30.12" y1="43.48" x2="31.88" y2="46.52" gradientUnits="userSpaceOnUse">
            			<stop offset="0" stop-color="#86c3db"/>
            			<stop offset="0.45" stop-color="#86c3db"/>
            			<stop offset="1" stop-color="#5eafcf"/>
            		</linearGradient>
            		<linearGradient id="c" x1="29.67" y1="42.69" x2="32.33" y2="47.31" href="#b"/>
            		<linearGradient id="d" x1="23.12" y1="43.48" x2="24.88" y2="46.52" href="#b"/>
            		<linearGradient id="e" x1="22.67" y1="42.69" x2="25.33" y2="47.31" href="#b"/>
            		<linearGradient id="f" x1="37.12" y1="43.48" x2="38.88" y2="46.52" href="#b"/>
            		<linearGradient id="g" x1="36.67" y1="42.69" x2="39.33" y2="47.31" href="#b"/>
            	</defs>
            	<path d="M46.5,31.5l-.32,0a10.49,10.49,0,0,0-19.11-8,7,7,0,0,0-10.57,6,7.21,7.21,0,0,0,.1,1.14A7.5,7.5,0,0,0,18,45.5a4.19,4.19,0,0,0,.5,0v0h28a7,7,0,0,0,0-14Z" stroke="#e6effc" stroke-miterlimit="10" stroke-width="0.5" fill="url(#a)"/>
            	<g>
            		<circle cx="31" cy="45" r="1.25" fill="none" stroke-miterlimit="10" stroke="url(#b)"/>
            		<path d="M33.17,46.25l-1.09-.63m-2.16-1.24-1.09-.63M31,42.5v1.25m0,3.75V46.25m-1.08-.63-1.09.63m4.34-2.5-1.09.63" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke="url(#c)"/>
            		<animateTransform attributeName="transform" type="translate" additive="sum" values="-1 -6; 1 12" dur="4s" repeatCount="indefinite"/>
            		<animateTransform attributeName="transform" type="rotate" additive="sum" values="0 31 45; 360 31 45" dur="9s" repeatCount="indefinite"/>
            		<animate attributeName="opacity" values="0;1;1;1;0" dur="4s" repeatCount="indefinite"/>
            	</g>
            	<g>
            		<circle cx="24" cy="45" r="1.25" fill="none" stroke-miterlimit="10" stroke="url(#d)"/>
            		<path d="M26.17,46.25l-1.09-.63m-2.16-1.24-1.09-.63M24,42.5v1.25m0,3.75V46.25m-1.08-.63-1.09.63m4.34-2.5-1.09.63" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke="url(#e)"/>
            		<animateTransform attributeName="transform" type="translate" additive="sum" values="1 -6; -1 12" begin="-2s" dur="4s" repeatCount="indefinite"/>
            		<animateTransform attributeName="transform" type="rotate" additive="sum" values="0 24 45; 360 24 45" dur="9s" repeatCount="indefinite"/>
            		<animate attributeName="opacity" values="0;1;1;1;0" begin="-2s" dur="4s" repeatCount="indefinite"/>
            	</g>
            	<g>
            		<circle cx="38" cy="45" r="1.25" fill="none" stroke-miterlimit="10" stroke="url(#f)"/>
            		<path d="M40.17,46.25l-1.09-.63m-2.16-1.24-1.09-.63M38,42.5v1.25m0,3.75V46.25m-1.08-.63-1.09.63m4.34-2.5-1.09.63" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke="url(#g)"/>
            		<animateTransform attributeName="transform" type="translate" additive="sum" values="1 -6; -1 12" begin="-1s" dur="4s" repeatCount="indefinite"/>
            		<animateTransform attributeName="transform" type="rotate" additive="sum" values="0 38 45; 360 38 45" dur="9s" repeatCount="indefinite"/>
            		<animate attributeName="opacity" values="0;1;1;1;0" begin="-1s" dur="4s" repeatCount="indefinite"/>
            	</g>
            </svg>
        ),
        비: (
            <svg x="42" y="87" width="187px" height="187px" viewBox="0 0 64 64">
            	<defs>
            		<linearGradient id="a" x1="22.56" y1="21.96" x2="39.2" y2="50.8" gradientUnits="userSpaceOnUse">
            			<stop offset="0" stop-color="#f3f7fe"/>
            			<stop offset="0.45" stop-color="#f3f7fe"/>
            			<stop offset="1" stop-color="#deeafb"/>
            		</linearGradient>
            		<linearGradient id="b" x1="22.53" y1="42.95" x2="25.47" y2="48.05" gradientUnits="userSpaceOnUse">
            			<stop offset="0" stop-color="#4286ee"/>
            			<stop offset="0.45" stop-color="#4286ee"/>
            			<stop offset="1" stop-color="#0950bc"/>
            		</linearGradient>
            		<linearGradient id="c" x1="29.53" y1="42.95" x2="32.47" y2="48.05" href="#b"/>
            		<linearGradient id="d" x1="36.53" y1="42.95" x2="39.47" y2="48.05" href="#b"/>
            	</defs>
            	<path d="M46.5,31.5l-.32,0a10.49,10.49,0,0,0-19.11-8,7,7,0,0,0-10.57,6,7.21,7.21,0,0,0,.1,1.14A7.5,7.5,0,0,0,18,45.5a4.19,4.19,0,0,0,.5,0v0h28a7,7,0,0,0,0-14Z" stroke="#e6effc" stroke-miterlimit="10" stroke-width="0.5" fill="url(#a)"/>
            	<line x1="24.39" y1="43.03" x2="23.61" y2="47.97" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke="url(#b)">
            		<animateTransform attributeName="transform" type="translate" values="1 -5; -2 10" dur="0.7s" repeatCount="indefinite"/>
            		<animate attributeName="opacity" values="0;1;1;0" dur="0.7s" repeatCount="indefinite"/>
            	</line>
            	<line x1="31.39" y1="43.03" x2="30.61" y2="47.97" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke="url(#c)">
            		<animateTransform attributeName="transform" begin="-0.4s" type="translate" values="1 -5; -2 10" dur="0.7s" repeatCount="indefinite"/>
            		<animate attributeName="opacity" begin="-0.4s" values="0;1;1;0" dur="0.7s" repeatCount="indefinite"/>
            	</line>
            	<line x1="38.39" y1="43.03" x2="37.61" y2="47.97" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke="url(#d)">
            		<animateTransform attributeName="transform" begin="-0.2s" type="translate" values="1 -5; -2 10" dur="0.7s" repeatCount="indefinite"/>
            		<animate attributeName="opacity" begin="-0.2s" values="0;1;1;0" dur="0.7s" repeatCount="indefinite"/>
            	</line>
            </svg>
        ),
    };

    const weatherTexts = {
        '맑은 하늘': ["햇살", " 가득한 날, 이 애니메이션과 함께!"],
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
                <g>
                    {weatherIcons[currentWeather]}
                </g>

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
                    className={styles[`weather-text-${currentWeather ? currentWeather.replace(' ', '-') : 'default'}`]}
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
    </div>
    );
};

export default Weather;
