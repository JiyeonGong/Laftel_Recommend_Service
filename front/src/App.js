import './App.css';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import Main from "./pages/Main"
import LoginCallback from "./pages/LoginCallback"
import ProfileSetup from "./pages/ProfileSetup"
import Chatting from "./pages/Chatting"
import Storage from "./pages/Storage"

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Main />} /> {/* 메인페이지 */}
                <Route path="/oauth2/callback" element={<LoginCallback />} /> {/* 로그인 redirect 페이지 */}
                <Route path="/user/profile/setup" element={<ProfileSetup />} /> {/* 신규 사용자 정보 수집 페이지 */}
                <Route path="/chat/teruteru" element={<Chatting />} /> {/* 신규 사용자 정보 수집 페이지 */}
                <Route path="*" element={<Main />} /> {/*  -  */}
                <Route path="/storage" element={<Storage />} /> {/*보관함 페이지(찜목록)*/}
            </Routes>
        </AuthProvider>
    );
}

export default App;
