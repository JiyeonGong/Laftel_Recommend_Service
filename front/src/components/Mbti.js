import React, { useState, useEffect  } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Mbti.module.css';

const Mbti = ({ setMbti, handleSearch }) => {
    const [mbtiValues, setMbtiValues] = useState({
        first: 'E',
        second: 'N',
        third: 'F',
        fourth: 'P',
    });

    useEffect(() => {
        const mbti = `${mbtiValues.first}${mbtiValues.second}${mbtiValues.third}${mbtiValues.fourth}`;
        setMbti(mbti);
    }, [mbtiValues, setMbti]);

    const toggleValue = (key, value1, value2) => {
        setMbtiValues((prevValues) => ({
            ...prevValues,
            [key]: prevValues[key] === value1 ? value2 : value1,
        }));
    };

    const handleClick = () => {
        const mbtiValue = `${mbtiValues.first}${mbtiValues.second}${mbtiValues.third}${mbtiValues.fourth}`;
        setMbti(mbtiValue);
        handleSearch(mbtiValue);
    };

    return (
        <div className={styles.mbtiComponent}>
            <svg width="670" height="270" viewBox="0 0 670 270" fill="none">
                {/* Mbti 배경 컴포넌트 */}
                <path d="M20 0.5H650C660.77 0.5 669.5 9.23045 669.5 20V250C669.5 260.77 660.77 269.5 650 269.5H20C9.23043 269.5 0.5 260.77 0.5 250V20C0.5 9.23045 9.23045 0.5 20 0.5Z" fill="#F4F6FB" stroke="#ECECF2"/>

                {/* 보라색 원 */}
                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M195.643 158.211C195.643 186.163 173.113 208.822 145.322 208.822C117.53 208.822 95 186.163 95 158.211C95 130.26 117.53 107.601 145.322 107.601C173.113 107.601 195.643 130.26 195.643 158.211Z" fill="#425DF8"
                        onClick={() => {
                                toggleValue('first', 'E', 'I');
                                handleClick();
                            }
                        }
                        className={styles.purpleClick}
                        transform="translate(0, 0)"
                    />
                    <text
                        x="145" y="163"
                        fontSize="50" fontWeight="600" fill="white"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                        fontFamily="Inter, sans-serif"
                    >
                        {mbtiValues.first}
                    </text>
                </motion.g>

                {/* 하얀색 원 */}
                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M321.641 158.748C321.641 186.699 299.015 209.358 271.104 209.358C243.194 209.358 220.568 186.699 220.568 158.748C220.568 130.797 243.194 108.138 271.104 108.138C299.015 108.138 321.641 130.797 321.641 158.748Z" fill="#FCFCFC"
                        onClick={() => {
                                toggleValue('second', 'S', 'N');
                                handleClick();
                            }
                        }
                        className={styles.whiteClick}
                    />
                    <text
                        x="271" y="163"
                        fontSize="50" fontWeight="600" fill="black"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                        fontFamily="Inter, sans-serif"
                    >
                        {mbtiValues.second}
                    </text>
                </motion.g>

                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M448.089 158.802C448.089 186.753 425.463 209.412 397.553 209.412C369.642 209.412 347.016 186.753 347.016 158.802C347.016 130.85 369.642 108.191 397.553 108.191C425.463 108.191 448.089 130.85 448.089 158.802Z" fill="#FCFCFC"
                        onClick={() => {
                                toggleValue('third', 'F', 'T');
                                handleClick();
                            }
                        }
                        className={styles.whiteClick}
                    />
                    <text
                        x="398" y="163"
                        fontSize="50" fontWeight="600" fill="black"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                        fontFamily="Inter, sans-serif"
                    >
                        {mbtiValues.third}
                    </text>
                </motion.g>

                <motion.g whileTap={{ scale: 0.9, rotate: 3 }} style={{ outline: 'none' }}>
                    <path d="M574.089 157.844C574.089 185.795 551.463 208.454 523.553 208.454C495.642 208.454 473.016 185.795 473.016 157.844C473.016 129.893 495.642 107.234 523.553 107.234C551.463 107.234 574.089 129.893 574.089 157.844Z" fill="#FCFCFC"
                        onClick={() => {
                                toggleValue('fourth', 'P', 'J');
                                handleClick();
                            }
                        }
                        className={styles.whiteClick}
                    />
                    <text
                        x="525" y="163"
                        fontSize="50"
                        fill="black" fontWeight="600" textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                        fontFamily="Inter, sans-serif"
                    >
                        {mbtiValues.fourth}
                    </text>
                </motion.g>

                <text x="230" y="40" fontSize="17" fill="black" fontWeight="500"
                    fontFamily="Gumi Romance TTF, sans-serif">
                    MBTI로 보는 추천 애니메이션 !
                </text>
                <text x="255" y="66" fontSize="11.5" fill="#A1A1A6" fontWeight="500"
                    fontFamily="Gumi Romance TTF, sans-serif">
                    버튼을 눌러 MBTI를 변경해주세요.
                </text>
            </svg>
        </div>
    );
}

export default Mbti;
