import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Mbti.module.css';
import axios from 'axios';

const Mbti = () => {
    const [mbti, setMbti] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mbtiValues, setMbtiValues] = useState({
        first: 'E',
        second: 'S',
        third: 'F',
        fourth: 'P',
    });

    const toggleValue = (key, value1, value2) => {
        setMbtiValues((prevValues) => ({
            ...prevValues,
            [key]: prevValues[key] === value1 ? value2 : value1,
        }));
    };

    // Flask 서버와 통신하도록 API URL 수정
    const API_URL = process.env.REACT_APP_MBTI_API_URL || 'http://localhost:5001/api/mbti_recommendations';

    const handleMbtiChange = (e) => {
        setMbti(e.target.value);
    };

    const handleSearch = async () => {
        const mbti = `${mbtiValues.first}${mbtiValues.second}${mbtiValues.third}${mbtiValues.fourth}`;
        setLoading(true);
        setError("");
        setRecommendations([]);

        try {
            const response = await axios.post(API_URL, { mbti });
            setRecommendations(response.data);
        } catch (err) {
            console.error("Error fetching MBTI recommendations", err);
            setError("추천을 가져오는 도중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
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
        <div className={styles.mbtiComponent}>
            <svg width="667" height="282" viewBox="0 0 1250 503" fill="none">
                {/* Mbti 배경 컴포넌트 */}
                <path d="M0.5 39C0.5 17.737 17.737 0.5 39 0.5H1211C1232.26 0.5 1249.5 17.737 1249.5 39V464C1249.5 485.263 1232.26 502.5 1211 502.5H39C17.737 502.5 0.5 485.263 0.5 464V39Z" fill="#F4F6FB" stroke="#ECECF2"/>

                {/* 보라색 원 */}
                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M381.767 257.285C381.767 309.357 339.734 351.569 287.883 351.569C236.033 351.569 194 309.357 194 257.285C194 205.213 236.033 163 287.883 163C339.734 163 381.767 205.213 381.767 257.285Z" fill="#425DF8"
                        onClick={() => toggleValue('first', 'E', 'I')}
                        className={styles.purpleClick}
                    />
                    <text
                        x="285" y="270"
                        fontSize="100" fontWeight="600" fill="white"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                    >
                        {mbtiValues.first}
                    </text>
                </motion.g>

                {/* 하얀색 원 */}
                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M605.643 258.285C605.643 310.357 563.43 352.569 511.358 352.569C459.286 352.569 417.074 310.357 417.074 258.285C417.074 206.213 459.286 164 511.358 164C563.43 164 605.643 206.213 605.643 258.285Z" fill="#FCFCFC"
                        onClick={() => toggleValue('second', 'S', 'N')}
                        className={styles.whiteClick}
                    />
                </motion.g>

                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M830.322 257.285C830.322 309.357 788.109 351.569 736.037 351.569C683.965 351.569 641.752 309.357 641.752 257.285C641.752 205.213 683.965 163 736.037 163C788.109 163 830.322 205.213 830.322 257.285Z" fill="#FCFCFC"
                        onClick={() => toggleValue('third', 'F', 'T')}
                        className={styles.whiteClick}
                    />
                </motion.g>

                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M1055 257.285C1055 309.357 1012.79 351.569 960.715 351.569C908.643 351.569 866.431 309.357 866.431 257.285C866.431 205.213 908.643 163 960.715 163C1012.79 163 1055 205.213 1055 257.285Z" fill="#FCFCFC"
                        onClick={() => toggleValue('fourth', 'P', 'J')}
                        className={styles.whiteClick}
                    />
                </motion.g>

                {/* 조회 버튼 배경 */}
                <path d="M570.5 427C570.5 414.574 580.574 404.5 593 404.5H659C671.426 404.5 681.5 414.574 681.5 427C681.5 439.426 671.426 449.5 659 449.5H593C580.574 449.5 570.5 439.426 570.5 427Z"
                    fill="#121212"
                    onClick={handleSearch}
                    className={styles.searchBtn}/>

                <text x="45" y="70" fontSize="30" fill="black" fontWeight="600">
                    MBTI로 보는 추천 애니메이션 !
                </text>
                <text x="45" y="115" fontSize="23" fill="#87878C" fontWeight="600">
                    버튼을 눌러 MBTI를 변경해주세요.
                </text>

                <text
                    x="510" y="270"
                    fontSize="100" fontWeight="600" fill="black"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                >
                    {mbtiValues.second}
                </text>
                <text
                    x="735" y="270"
                    fontSize="100" fontWeight="600" fill="black"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                >
                    {mbtiValues.third}
                </text>
                <text
                    x="960" y="270"
                    fontSize="100"
                    fill="black"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                >
                    {mbtiValues.fourth}
                </text>
                <text
                    x="605" y="435"
                    fontSize="20" fontWeight="700" fill="white"
                    pointerEvents="none"
                >
                    조회
                </text>
            </svg>

            <div className={styles.weatherContainer}>
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

export default Mbti;
