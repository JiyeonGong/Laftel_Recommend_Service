import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../api/AuthContext";
import styles from '../styles/ProfileSetup.module.css';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { login, tempAuth, clearTempAuth } = useContext(AuthContext);
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [ageRange, setAgeRange] = useState('');
    const [mbti, setMbti] = useState('');
    const kakaoId = tempAuth?.kakaoId;

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]); // 이미지 파일 객체 저장
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
            formData.append('kakaoId', kakaoId);
            formData.append('nickname', nickname);
            formData.append('gender', gender);
            formData.append('ageRange', ageRange);
            formData.append('mbti', mbti);
            formData.append('profileImage', profileImage);

        try {
            // DB에 저장
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/user/profile/setup`, {
                method: 'POST',
                body: formData,
            });

            login(tempAuth);
            clearTempAuth();
            navigate("/");
        } catch (error) {
            console.error('서버 요청 중 오류가 발생했습니다.', error);
            alert("프로필 정보 저장에 실패했습니다.");
        }
    };

    return (
        <div className="formContainer">
            <h2>프로필 설정</h2>
            <form onSubmit={handleSubmit}>
                <label className={styles.formLabel}>
                    닉네임:
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </label>
                <label className={styles.formLabel}>
                    성별:
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="M">남성</option>
                        <option value="F">여성</option>
                        <option value="O">기타</option>
                    </select>
                </label>
                <label className={styles.formLabel}>
                    프로필 이미지:
                    <input type="file" onChange={handleFileChange} />
                </label>
                <label className={styles.formLabel}>
                    연령대:
                    <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="10대">10대</option>
                        <option value="20대">20대</option>
                        <option value="30대">30대</option>
                        <option value="40대">40대</option>
                        <option value="50대 이상">50대 이상</option>
                    </select>
                </label>
                <label className={styles.formLabel}>
                    MBTI:
                    <input type="text" value={mbti} onChange={(e) => setMbti(e.target.value)} />
                </label>
                <button className={styles.formButton} type="submit">저장</button>
            </form>
        </div>
    )
}

export default ProfileSetup;