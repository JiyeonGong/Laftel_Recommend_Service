import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

        if (storedUser && storedIsLoggedIn === "true") {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    //userData -> { kakaoAccessToken, jwtToken, refreshToken, kakaoId }
    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
    };

    const logout = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const kakaoAccessToken = userData.kakaoAccessToken;

            if (!kakaoAccessToken) {
                throw new Error("kakaoAccessToken이 없습니다.");
            }

            await axios.post(
                "https://kapi.kakao.com/v1/user/logout",
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${kakaoAccessToken}`
                    },
                }
            );

            setIsLoggedIn(false);
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
            navigate("/");
        } catch (error) {
            if (error.response?.status === 401 || error.message === "Failed to fetch") {
                localStorage.clear();
                sessionStorage.clear();
                setIsLoggedIn(false);
                setUser(null);
                navigate('/');
            } else {
                console.error("로그아웃 처리 중 오류 발생:", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};