import React from 'react';
import Header from '../components/Header';
import Top from '../components/Top';
import Weather from '../components/Weather';
import Mbti from '../components/Mbti';

import archive1 from "./assets/archive1.png";
import bar from "./assets/bar.png";
import green from "./assets/green.png";
import help2 from "./assets/help2.png";
import home from "./assets/home.png";
import logIn from "./assets/log-in.png";

import profile from "./assets/profile.png";
import red from "./assets/red.png";
import search from "./assets/search.png";
import slider from "./assets/slider.png";
import yellow from "./assets/yellow.png";

import "./style.css";

// Slider Component
const Slider = () => (
    <div className="before-login">
        <div className="overlap">
            <div className="root">
                <div className="overlap-group">
                    <div className="slider" style={{ backgroundImage: `url(${slider})` }} />
                </div>
            </div>

            <div className="view">
                <img className="profile" alt="Profile" src={profile}/>
                <div className="bar-wrapper">
                    <img className="bar" alt="Bar" src={bar} />
                </div>
                <img className="search" alt="Search" src={search} />
                <img className="home" alt="Home" src={home} />
                <img className="help" alt="Help" src={help2} />

                <img className="green" alt="Green" src={green} />
                <img className="yellow" alt="Yellow" src={yellow} />
                <img className="red" alt="Red" src={red} />
                <img className="archive" alt="Archive" src={archive1} />
                <img className="log-in" alt="Log In" src={logIn} />
            </div>
        </div>
    </div>
);

// View Component
const View = () => (
    <div className="view-container">
        <p>View Component Placeholder</p>
    </div>
);

// Main Content Component
const MainContent = () => (
    <div className="figma-design">
        <div className="overlap">
            <div className="root">
                <div className="overlap-group">
                    <Slider />
                </div>
            </div>
            <View />
        </div>
    </div>
);

// Main Component
const Main = () => {
    return (
        <div>
            <MainContent />
            {/* Header, Top, Weather, Mbti를 InfoSection으로 묶어서 간결하게 표현 */}
            <div className="info-section">
                <Header />
                <div className="divider"></div>
                <Top />
                <div className="divider"></div>
                <Weather />
                <div className="divider"></div>
                <Mbti />
            </div>
        </div>
    );
};

export default Main;
