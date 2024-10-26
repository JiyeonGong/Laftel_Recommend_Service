import React, { useEffect } from 'react';
import axios from "axios";

const Login = () => {
    const API_KEY = process.env.REACT_APP_API_KEY; //REST API KEY
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI; //Redirect URI
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

    // 로그인 버튼 클릭 시 카카오 OAuth 페이지로 리다이렉트
    const handleLogin = () => {
        window.location.href = kakaoURL
    }

    return (
        <div>
            <img src="/image/kakao_login.png" alt="Kakao Logo" onClick={handleLogin}/>
        </div>
    );
};

export default Login;