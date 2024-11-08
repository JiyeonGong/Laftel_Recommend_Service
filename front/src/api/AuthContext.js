import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tempAuth, setTempAuth] = useState(null); // 임시 상태 저장용

    // 1. JWT 토큰 만료시 refreshToken으로 재발급 하는 함수

    // 2. JWT 토큰 만료 시간 체크하는 함수

    const login = ({ kakaoAccessToken, jwtToken, refreshToken, kakaoId }) => {
        setIsLoggedIn(true);
        localStorage.setItem("kakaoAccessToken", kakaoAccessToken)
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("kakaoId", kakaoId);
        console.log("Setting kakaoAccessToken:", kakaoAccessToken);
    };

    const logout = async () => {
        try {
            const kakaoAccessToken = localStorage.getItem("kakaoAccessToken");
            await axios.post(
                "https://kapi.kakao.com/v1/user/logout",
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${kakaoAccessToken}`
                    },
                }
            );

            console.log("로그아웃 성공");

            setIsLoggedIn(false);
            clearTempAuth();
            localStorage.clear();
            sessionStorage.clear();

            console.log("localStorage - kakaoAccessToken:", localStorage.getItem("kakaoAccessToken"));
            console.log("localStorage - jwtToken:", localStorage.getItem("jwtToken"));
            console.log("localStorage - refreshToken:", localStorage.getItem("refreshToken"));
            console.log("localStorage - kakaoId:", localStorage.getItem("kakaoId"));

            navigate("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const storeTempAuth = (authData) => {
        setTempAuth(authData);
    };

    const clearTempAuth = () => {
        setTempAuth(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, tempAuth, storeTempAuth, clearTempAuth }}>
            {children}
        </AuthContext.Provider>
    );
};