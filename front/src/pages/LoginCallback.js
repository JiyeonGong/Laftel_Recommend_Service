import { useNavigate } from "react-router-dom";
import { AuthContext } from "../api/AuthContext";
import React, { useEffect, useContext, useState } from 'react';
import axios from "axios"

const LoginCallback = () => {
    const navigate = useNavigate();
    const { login, storeTempAuth } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const code = new URL(window.location.href).searchParams.get("code"); // url에서 인가 코드를 추출

    useEffect(() => {
        if (code && !isFetching) {
            setIsFetching(true);

            // 인가 코드로 사용자의 kakaoId 조회
            const getUserInfo = async () => {
                try {
                    const res = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URI}/kakaoApi/login`,
                        { code },
                        { headers: { "Content-Type": "application/json" } }
                    )

                    // 신규, 기존 사용자 구분해서 ProfileSetup 페이지로 이동 여부에 따른 처리와 DB 저장
                    // 사용자 정보 로컬스토리지에 저장 / 로그인 상태 업데이트
                    const { kakaoAccessToken, jwtToken, refreshToken, kakaoId, isExistingUser } = res.data;
                    if (isExistingUser) {
                        login({ kakaoAccessToken, jwtToken, refreshToken, kakaoId });
                        navigate("/");
                    } else {
                        storeTempAuth({ kakaoAccessToken, jwtToken, refreshToken, kakaoId });
                        navigate("/user/profile/setup");
                    }

                } catch (error) {
                    console.error("카카오 로그인 중 에러 발생", error);
            }
        };

            getUserInfo();
        }
    }, [code, login, navigate]);

    return (
        <div>
            <h2>로그인 중 .. </h2>
        </div>
    )
}

export default LoginCallback;