import { useNavigate } from "react-router-dom";
import { AuthContext } from "../api/AuthContext";
import React, { useEffect, useContext, useState } from 'react';
import axios from "axios"

const LoginCallback = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const code = new URL(window.location.href).searchParams.get("code"); // url에서 인가 코드를 추출

    useEffect(() => {
        // code가 존재하고 아직 요청 중이 아닐 때만 실행 -> 중복 호출 방지
        if (code && !isFetching) {
            setIsFetching(true);

            // 인가 코드 -> 백엔드로 보냄
            const getUserInfo = async () => {
                try {
                const res = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URI}/kakaoApi/login`,
                    { code },
                    { headers: { "Content-Type": "application/json" } }
                )
                console.log(res);

                // 받은 사용자 정보를 로컬스토리지에 저장 / 로그인 상태 업데이트
                const { kakaoAccessToken, jwtToken, refreshToken, kakaoId } = res.data;
                login({ kakaoAccessToken, jwtToken, refreshToken, kakaoId });

                // 메인페이지로 이동
                navigate("/");
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