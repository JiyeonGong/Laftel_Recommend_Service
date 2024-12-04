import './App.css';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./api/AuthContext";
import Main from "./pages/Main"
import LoginCallback from "./pages/LoginCallback"
import ProfileSetup from "./pages/ProfileSetup"
import Chatting from "./pages/Chatting"
import Storage from "./pages/Storage"
import HelpUser from "./pages/HelpUser"
import HelpAdmin from "./pages/HelpAdmin"

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Main />} /> {/* 메인페이지 */}
                <Route path="/oauth2/callback" element={<LoginCallback />} /> {/* 로그인 redirect 페이지 */}
                <Route path="/user/profile/setup" element={<ProfileSetup />} /> {/* 신규 사용자 정보 수집 페이지 */}
                <Route path="/chat/teruteru" element={<Chatting />} /> {/* 신규 사용자 정보 수집 페이지 */}
                <Route path="/storage" element={<Storage />} /> {/* 보관함 페이지 */}
                <Route path="/help/admin" element={<HelpAdmin />} /> {/* 문의 페이지(admin) */}
                <Route path="/help/user" element={<HelpUser />} /> {/* 문의 페이지(user) */}
                <Route path="*" element={<Main />} /> {/*  -  */}
            </Routes>
        </AuthProvider>
    );
}

export default App;
