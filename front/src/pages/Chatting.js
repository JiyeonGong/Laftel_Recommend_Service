import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Chatting.module.css';
import logo from '../assets/logo.svg'; // 로고 파일 임포트
import goToMainIcon from '../assets/GoToMain.svg'; // 메인으로 이동 버튼 아이콘
import textAreaBackground from '../assets/textArea.svg'; // 채팅 입력 배경 이미지
import explainImage from '../assets/explain.svg'; // 채팅페이지 설명 이미지 파일
import miniTeruImage from '../assets/miniLAF.svg'; // 테루테루 이미지 예시 파일
import { useNavigate } from 'react-router-dom';

function Chatting() {
    const [message, setMessage] = useState("");
    const [mbti, setMbti] = useState("");
    const [chatResponse, setChatResponse] = useState(""); // 최종 응답
    const [displayedResponse, setDisplayedResponse] = useState(""); // 타이핑 효과 적용 상태
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1000);
    const navigate = useNavigate();


    const handleMainButtonClick = () => {
        navigate('/');
    };

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("위치 정보를 가져오는 중 오류 발생:", error);
                    alert("위치 정보를 가져오는 데 실패했습니다. 위치 접근을 허용해 주세요.");
                }
            );
        } else {
            alert("Geolocation을 지원하지 않는 브라우저입니다.");
        }

        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1000);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setDisplayedResponse(""); // 초기화 처리로 인해 undefined 방지
    }, []);



    const sendMessage = () => {
        if (!mbti) {
            alert("MBTI를 입력해주세요.");
            return;
        }

        if (latitude === null || longitude === null) {
            alert("위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        axios.post('http://localhost:5001/api/chatbot', {
            message: message,
            latitude: latitude,
            longitude: longitude,
            api_key: apiKey,
            mbti: mbti
        })
            .then(response => {
                if (response.data && response.data.response) {
                    console.log("응답 데이터:", response.data.response); // 응답 데이터를 콘솔에 출력
                    setChatResponse(response.data.response || "추천된 애니메이션이 없습니다.");
                    typeMessage(response.data.response);
                } else {
                    console.error("응답 데이터에 문제가 있습니다.", response.data);
                    setChatResponse("서버 응답에서 유효한 데이터를 찾지 못했습니다.");
                    typeMessage("서버 응답에서 유효한 데이터를 찾지 못했습니다.");
                }
            })
            .catch(error => {
                console.error("오류 발생!", error);
                setChatResponse("서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.");
                typeMessage("서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.");
            });

    };
    // 타이핑 효과 함수
    const typeMessage = (message) => {
        // 먼저 빈 문자열로 초기화
        if (!message || message.length === 0) {
            setDisplayedResponse(""); // 기본값 설정
            return;
        }

        // 타이핑 효과를 주기 위한 인덱스 초기화
        setDisplayedResponse(""); // 타이핑 시작 전 빈 상태로 초기화
        let index = 0;// 첫 번째 글자를 즉시 추가

        if (message.length > 0) {
            setDisplayedResponse(message[0]);
            index = 0; // 첫 번째 글자를 이미 추가했으므로 인덱스를 1로 시작
        }

        // 첫 글자 이후의 문자들을 추가하기 위한 Interval 설정
        const interval = setInterval(() => {
            if (index < message.length) {
                setDisplayedResponse((prev) => prev + message.charAt(index));
                index++;
            } else {
                clearInterval(interval); // 모든 문자를 추가했으면 Interval을 종료
            }
        }, 30);
    };
    // 렌더링 시 상태값 추적을 위한 콘솔 로그 추가
   //console.log("렌더링 시 chatResponse:", chatResponse);
    //console.log("렌더링 시 displayedResponse:", displayedResponse);


    return (
        <div className={styles.body}>
            {/* 로고바 추가 */}
            <div className={styles.menuBar}>
                <img
                    src={logo}
                    alt="Logo"
                    className={`${styles.logo} ${styles.centerLogo}`}
                    onClick={() => isSmallScreen && handleMainButtonClick()}
                    style={{ cursor: isSmallScreen ? 'pointer' : 'default' }}
                />
                {!isSmallScreen && (
                    <div className={styles.goToMainWrapper}>
                        <img
                            src={goToMainIcon}
                            alt="Go to Main"
                            className={styles.mainButtonIcon}
                            onClick={handleMainButtonClick}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'invert(42%) sepia(82%) saturate(5036%) hue-rotate(232deg) brightness(102%) contrast(102%)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                        />
                    </div>
                )}
            </div>

            {/* 새로운 컨테이너 추가 */}
            <div className={styles.mainContainer}>
                {/* 설명 이미지 추가 */}
                <div className={styles.imageContainer}>
                    <img src={miniTeruImage} alt="Mini Teru" className={styles.miniTeruImage}/>
                    <img src={explainImage} alt="Explanation" className={styles.explainImage}/>
                </div>


                {/* 채팅 전체 컨테이너 */}
                <div className={styles.chatContainer}>
                    {/* 채팅 박스 */}
                    <div className={styles.chatBox}>
                        <h1>테루테루 :</h1>

                        {/* 채팅 응답 */}
                        <div className={styles.response}>
                            <p>{displayedResponse && displayedResponse !== "undefined" ? displayedResponse : "안녕하세요! 좋은 하루 보내셨나요? 아직 추천을 받지 않으셨네요!"}</p>
                    </div>

                </div>

                {/* 채팅 입력 영역 */}
                <div className={styles.chatInputContainer}>
                    <select
                        id="mbti-select"
                        value={mbti}
                        onChange={(e) => setMbti(e.target.value)}
                        className={styles.selectField}
                    >
                        <option value="">MBTI</option>
                        <option value="INTJ">INTJ</option>
                        <option value="INTP">INTP</option>
                        <option value="ENTJ">ENTJ</option>
                        <option value="ENTP">ENTP</option>
                        <option value="INFJ">INFJ</option>
                        <option value="INFP">INFP</option>
                        <option value="ENFJ">ENFJ</option>
                        <option value="ENFP">ENFP</option>
                        <option value="ISTJ">ISTJ</option>
                        <option value="ISFJ">ISFJ</option>
                        <option value="ESTJ">ESTJ</option>
                        <option value="ESFJ">ESFJ</option>
                        <option value="ISTP">ISTP</option>
                        <option value="ISFP">ISFP</option>
                        <option value="ESTP">ESTP</option>
                        <option value="ESFP">ESFP</option>
                    </select>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={styles.inputField}
                        placeholder="MBTI를 선택하고 테루테루에게 애니메이션을 추천받아보세요."
                        style={{
                            backgroundImage: `url(${textAreaBackground})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                        }}
                    />

                    <button onClick={sendMessage} className={styles.button}>
                        ⛅︎
                    </button>
                </div>
            </div>
        </div>
            {/* Footer 추가 */}
            <footer className={styles.footer}>
                <p>© 2024 TERU-TERU. All rights reserved.</p>
                <div className={styles.footerLinks}>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/contact">Contact Us</a>
                </div>
            </footer>
        </div>
    );
}

export default Chatting;
