import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import logo from '../assets/logo.svg';
import styles from '../styles/HelpAdmin.module.css';

const HelpAdmin = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [helpList, setHelpList] = useState([]);
    const [selectedHelp, setSelectedHelp] = useState(null);
    const [formData, setFormData] = useState({ title: "", content: "" });

    useEffect(() => {
        const fetchHelpList = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/helps/admin/all`);
                if (!res.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }

                const data = await res.json();
                setHelpList(data);

                if (data.length > 0) { setSelectedHelp(data[0]); }
            } catch (err) {
                console.log("문의 데이터를 불러오지 못했습니다.");
            }
        };

        const user = localStorage.getItem("user");
        setUserId(JSON.parse(user).kakaoId);
        fetchHelpList();
    }, []);

    const handleSelectHelp = (help) => {
        setSelectedHelp(help);
    };

    const getStatusInKorean = (status) => {
        const statusMap = {
            pending: "요청 중",
            resolved: "해결됨",
            in_progress: "진행 중",
        };
        return statusMap[status] || status;
    };

    const getStatusStyle = (status) => {
        const statusStyleMap = {
            pending: { color: "#DF8F44" },
            resolved: { color: "#63E95C" },
            in_progress: { color: "#3E68FF" },
        };
        return statusStyleMap[status] || { color: "gray" };
    };

    const handleStatusChange = async (helpId, currentStatus) => {
        const nextStatus = {
            pending: "in_progress",
            in_progress: "resolved",
            resolved: "pending",
        };

        const updatedStatus = nextStatus[currentStatus];

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/helps/${helpId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: updatedStatus }),
            });

            if (response.ok) {
                alert('상태가 성공적으로 변경되었습니다.');

                // 로컬 상태 업데이트
                setHelpList((prevList) =>
                    prevList.map((help) =>
                        help.id === helpId ? { ...help, status: updatedStatus } : help
                    )
                );
            } else {
                alert('상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('오류가 발생했습니다.');
        }
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

    const handleChange = (event) => {
        setFormData({
            ...formData,
            content: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const commentData = {
            helpId: selectedHelp.id,
            adminId: userId,
            content: formData.content,
        };
        console.log(commentData);

        try {
            const response = await fetch('/helps/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });
            if (response.ok) {
                alert('댓글이 성공적으로 저장되었습니다.');
                setFormData({ content: '' });
            } else {
                alert('댓글 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('오류가 발생했습니다.');
        }
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
                    <p className={styles.title}>전체 문의 리스트</p>
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
                                    <tr
                                        key={help.id}
                                        className={`${selectedHelp?.id === help.id ? styles.selectedRow : ""}`}
                                        onClick={() => handleSelectHelp(help)}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{help.title}</td>
                                        <td>{help.name || "Unknown"}</td>
                                        <td>{formatDateTime(help.createdAt)}</td>
                                        <td
                                            style={getStatusStyle(help.status)}
                                            onClick={() => handleStatusChange(help.id, help.status)}
                                        >
                                            {getStatusInKorean(help.status)}
                                        </td>
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
                    <div className={styles.detailContent}>
                        {selectedHelp ? (
                            <div className={styles.detailContent}>
                                <div className={styles.detailTitle}>
                                    <p style={{ color: '#B0A3FF' }}><strong>[ 제목 ]</strong></p>
                                    <p>{selectedHelp.title}</p>
                                </div>
                                <p style={{ color: '#B0A3FF' }}><strong>[ 내용 ]</strong></p>
                                <p>{selectedHelp.content}</p>
                                <form onSubmit={handleSubmit} className={styles.commentForm}>
                                    <div>
                                        <p style={{ color: '#B0A3FF' }}><strong>[ 코멘트 남기기 ]</strong></p>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            placeholder="남길 코멘트를 입력해주세요."
                                            rows="6"
                                            value={formData.content || ""}
                                            onChange={handleChange}
                                            className={styles.textArea}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className={styles.submitBtn}>
                                        등록
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <p>선택된 문의가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer style={{
                backgroundColor: '#161616',
                color: '#BDBDBD',
                borderTop: "0.01px solid #D7D7D7",
                padding: "15px 0px"
            }}/>
        </div>
    )
}

export default HelpAdmin;