import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import { LoginCallback } from "./pages/LoginCallback"

const App = () => {
    const nav = useNavigate();

    const onClickButton = (link) => {
        nav(link);
    };

    return (
        <>
            <div>
                <button onClick={() => onClickButton("/")}>Main 페이지로 이동</button>
            </div>
            <Routes>
                <Route path="/" element={<Main />} /> {/* 메인페이지 */}
                <Route path="/oauth2" element={<LoginCallback />} /> {/* 로그인 redirect 페이지 */}
                <Route path="/" element={<Main />} /> {/*  -  */}
            </Routes>
        </>
    );
}

export default App;
