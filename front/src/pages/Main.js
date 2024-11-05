import React from 'react';
import Header from '../components/Header'
import Top from '../components/Top'
import Weather from '../components/Weather'
import Mbti from '../components/Mbti'

const Main = () => {
    return (
        <div>
            <div>
                <Header /><hr />
            </div>
            <div>
                <Top /><hr />
                <Weather /><hr />
                <Mbti />
            </div>
        </div>
    )
}

export default Main;