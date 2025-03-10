import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../api/AuthContext";
import { useLocation } from "react-router-dom";
import styles from '../styles/ProfileSetup.module.css';
import axios from "axios";

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { login, tempAuth } = useContext(AuthContext);
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [mbti, setMbti] = useState('');
    const [error, setError] = useState('');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const kakaoId = queryParams.get("kakaoId");
    const kakaoAccessToken = queryParams.get("kakaoAccessToken");
    const jwtToken = queryParams.get("jwtToken");
    const refreshToken = queryParams.get("refreshToken");

    const validateForm = () => {
        if (!nickname || !gender || !ageRange || !mbti) {
            setError("모든 항목을 입력해주세요.");
            return false;
        }

        if (gender === "" || ageRange === "" || mbti === "") {
            setError("선택 항목을 선택해주세요.");
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('kakaoId', kakaoId);
        formData.append('nickname', nickname);
        formData.append('gender', gender);
        formData.append('ageRange', ageRange);
        formData.append('mbti', mbti);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // DB에 저장
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URI}/user/profile/setup`, formData);
            login({ kakaoAccessToken, jwtToken, refreshToken, kakaoId });
            navigate("/");
        } catch (error) {
            console.error('서버 요청 중 오류가 발생했습니다.', error);
            alert("프로필 정보 저장에 실패했습니다.");
        }
    };

    return (
        <div className={styles.parentContainer}>
            <div className={styles.formContainer}>
                <h2>프로필 설정</h2>
                <p>모든 항목은 필수입니다.</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className={styles.formLabel}>
                        닉네임
                        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </label>
                    <label className={styles.formLabel}>
                        성별
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">선택해주세요.</option>
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                            <option value="O">기타</option>
                        </select>
                    </label>
                    <label className={styles.formLabel}>
                        연령대
                        <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                            <option value="">선택해주세요.</option>
                            <option value="10대">10대</option>
                            <option value="20대">20대</option>
                            <option value="30대">30대</option>
                            <option value="40대">40대</option>
                            <option value="50대 이상">50대 이상</option>
                        </select>
                    </label>
                    <label className={styles.formLabel}>
                        MBTI
                        <select value={mbti} onChange={(e) => setMbti(e.target.value)}>
                            <option value="">선택해주세요.</option>
                            <option value="ENFP">ENFP</option>
                            <option value="ENFJ">ENFJ</option>
                            <option value="ENTP">ENTP</option>
                            <option value="ENTJ">ENTJ</option>
                            <option value="ESFP">ESFP</option>
                            <option value="ESFJ">ESFJ</option>
                            <option value="ESTP">ESTP</option>
                            <option value="ESTJ">ESTJ</option>
                            <option value="INFP">INFP</option>
                            <option value="INFJ">INFJ</option>
                            <option value="INTP">INTP</option>
                            <option value="INTJ">INTJ</option>
                            <option value="ISFP">ISFP</option>
                            <option value="ISFJ">ISFJ</option>
                            <option value="ISTP">ISTP</option>
                            <option value="ISTJ">ISTJ</option>
                        </select>
                    </label>
                    <button className={styles.formButton} type="submit">저장</button>
                </form>
            </div>
        </div>
    )
}

export default ProfileSetup;