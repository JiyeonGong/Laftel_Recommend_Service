import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import logo from '../assets/logo.svg';
import styles from '../styles/HelpUser.module.css';

const HelpUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [userId, setUserId] = useState("");
    const [helpsData, setHelpsData] = useState([]);
    const [selectedHelp, setSelectedHelp] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        setUserId(JSON.parse(user).kakaoId);
    }, []);

    useEffect(() => {
        if (userId) fetchHelpList();
    }, [userId]);

    const fetchHelpList = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/helps/list?kakaoId=${userId}`);
            if (!res.ok) {
                throw new Error("데이터를 불러오는 중 문제가 발생했습니다.");
            }

            const data = await res.json();
            setHelpsData(data);
        } catch {
            console.log("/helps/list api 요청 실패");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            userId,
            title: formData.title,
            content: formData.content,
        };

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/helps`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (!res.ok) {
                throw new Error("서버 요청 실패");
            }

            const result = await res.json();
            console.log("문의가 저장되었습니다:", result);

            alert("문의가 제출되었습니다.");
            setFormData({ title: "", content: "" });

            fetchHelpList();
        } catch (error) {
            console.log(error);
        }
    };

    const getStatusInKorean = (status) => {
        const statusMap = {
            pending: "요청 중",
            resolved: "해결됨",
            in_progress: "진행 중",
        };
        return statusMap[status] || status;
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const handleSelectHelp = (help) => {
        setSelectedHelp(help === selectedHelp ? null : help);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/helps/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("삭제 요청 실패");
            alert("문의가 삭제되었습니다.");
            fetchHelpList();
        } catch {
            console.log("삭제 요청 실패");
        }
    };

    const handleUpdate = async () => {

    };

    return (
        <>
            <img
                src={logo}
                alt="Logo"
                className={styles.logo}
                onClick={() => navigate('/')}
            />
            <div className={styles.mainContainer}>
                <div className={styles.listContainer}>
                    <h1 className={styles.title}>문의 목록</h1>
                    {helpsData.length > 0 ? (
                        helpsData.map((help, index) => (
                            <div key={index} className={styles.helpItem} onClick={() => handleSelectHelp(help)}>
                                <div className={styles.helpData}>
                                    <p>{help.title}</p>
                                    <div className={styles.infoContainer}>
                                        <p>{formatDateTime(help.createdAt)}</p>
                                        <p>{getStatusInKorean(help.status)}</p>
                                    </div>
                                </div>
                                {selectedHelp?.id === help.id && (
                                    <div className={styles.helpDetails}>
                                        <p>{help.content}</p>
                                        <button className={styles.editBtn} onClick={handleUpdate}>수정</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(help.id)}>삭제</button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p> 아직 작성한 문의 글이 없어요.</p>
                    )}
                </div>
                <div className={styles.contactContainer}>
                    <h1 className={styles.title}>문의하기</h1>
                    <form className={styles.formContainer} onSubmit={handleSubmit}>
                        <div className={styles.formContent}>
                            <label htmlFor="title" className={styles.label}>제목</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="문의 제목을 입력해주세요."
                                value={formData.title || ""}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.formContent}>
                            <label htmlFor="content" className={styles.label}>내용</label>
                            <textarea
                                id="content"
                                name="content"
                                placeholder="문의 내용을 입력해주세요."
                                rows="9"
                                value={formData.content || ""}
                                onChange={handleChange}
                                className={styles.textarea}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>제출</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default HelpUser;