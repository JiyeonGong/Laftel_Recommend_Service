import './App.css';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import Main from "./pages/Main"
import LoginCallback from "./pages/LoginCallback"
import ProfileSetup from "./pages/ProfileSetup"

const App = () => {
    // 관리자 여부에 따라 보이는 페이지가 다르게 수정 !!
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Main />} /> {/* 메인페이지 */}
                <Route path="/oauth2/callback" element={<LoginCallback />} /> {/* 로그인 redirect 페이지 */}
                <Route path="/user/profile/setup" element={<ProfileSetup />} /> {/* 신규 사용자 정보 수집 페이지 */}
                <Route path="*" element={<Main />} /> {/*  -  */}
            </Routes>
        </AuthProvider>
    );
}

export default App;
