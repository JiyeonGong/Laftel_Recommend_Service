import React from 'react';
import Header from 'components/Header'
import Top from 'components/Top'
import Weather from 'components/Weather'
import Mbti from 'components/Mbti'


const Main = () => {

    return (
        <div>
            <Header />
            <Top />
            <Weather />
            <Mbti />
        </div>
    )
}

export default Main;