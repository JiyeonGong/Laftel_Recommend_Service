import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

const LoginCallback = () => {
    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code"); // url에서 인가 코드를 추출
    console.log(code);
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };

    useEffect(() => {
        fetch(`보내줄 주소?code=${code}`, {
              method: "POST", //
              headers: headers,
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                console.log(data.result.user_id);
            })
            .catch((error) => {
                console.error("오류 발생", error); //
            });
    }, []);

    return (
        <div>
            <h2>로그인 중 .. </h2>
        </div>
    )
}

export default LoginCallback;