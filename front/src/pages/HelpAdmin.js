import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import logo from '../assets/logo.svg';
import styles from '../styles/HelpAdmin.module.css';

const HelpAdmin = () => {
    const navigate = useNavigate();
    const [helpList, setHelpList] = useState([]);

    useEffect(() => {
        const fetchHelpList = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/helps/admin/all`);
                if (!res.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }

                const data = await res.json();
                setHelpList(data);
            } catch (err) {
                console.log("문의 데이터를 불러오지 못했습니다.");
            }
        };
            fetchHelpList();
    }, []);

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

    return (
        <div className={styles.pageContainer}>
            <img
                src={logo}
                alt="Logo"
                className={styles.logo}
                onClick={() => navigate('/')}
            />
            <div className={styles.mainContainer}>
                <div className={styles.listContainer}>
                    <p className={styles.title}>문의 리스트</p>
                    {helpList.length > 0 ? (
                        <table className={`${styles.table} ${styles.tableSpacing}`}>
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th>작성일</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helpList.map((help, index) => (
                                    <tr key={help.id}>
                                        <td>{index + 1}</td>
                                        <td>{help.title}</td>
                                        <td>{help.userId?.name || "Unknown"}</td>
                                        <td>{formatDateTime(help.createdAt)}</td>
                                        <td>{getStatusInKorean(help.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>현재 등록된 문의가 없습니다.</p>
                    )}
                </div>
                <div className={styles.detailContainer}>
                    <p className={styles.title}>문의 상세정보</p>
                </div>
            </div>
            <Footer className={styles.footerCustom}/>
        </div>
    )
}

export default HelpAdmin;