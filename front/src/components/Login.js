import React, { useContext } from 'react';
import { AuthContext } from "../api/AuthContext";

const Login = () => {
    const API_KEY = process.env.REACT_APP_API_KEY; // REST API KEY
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI; // Redirect URI
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <div>
            {!isLoggedIn ? (
                <img src="/image/kakao_login.png" alt="Kakao Logo" onClick={() => window.location.href = kakaoURL} />
            ) : (
                <button onClick={logout}>로그아웃</button>
            )}
        </div>
    );
};

export default Login;