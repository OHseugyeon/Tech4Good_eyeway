import React, { useState, useEffect } from 'react';
import '../App.css';
import TTSOptions from './TTSOptions';
import SumComponent from './SumComponent';

function Popup() {
    const [accessibleDescription, setAccessibleDescription] = useState('여기에 생성된 접근성 설명이 표시됩니다.');
    const [imgSrc, setImgSrc] = useState(null);

    const { summary } = SumComponent();  // SumComponent에서 요약문을 가져옵니다.

    useEffect(() => {
        console.log("Summary received in Popup:", summary);  // 요약문이 제대로 전달되었는지 확인

        // 메시지 리스너 설정
        const messageListener = (request) => {
            if (request.accessibleDescription && request.imgSrc) {
                console.log("Received message:", request);
                setAccessibleDescription(request.accessibleDescription);
                setImgSrc(request.imgSrc);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        // 컴포넌트가 로드되었을 때 요약문을 TTS로 읽어줍니다.
        if (summary) {
            const msg = new SpeechSynthesisUtterance(summary);
            msg.lang = 'ko-KR';  // 언어 설정 (한국어)
            window.speechSynthesis.speak(msg);
        }

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, [summary]);

    return (
        <div className="popup-container">
            <div className="header">
                <h1 className="title">noongil</h1>
                <button className="close-button" onClick={() => window.close()}>✖</button>
            </div>

            <hr className="divider" />
            <div className="section">
                <h2 className="subtitle">생성된 접근성 설명을 확인하세요</h2>
                <div className="image-placeholder">
                    <div className="image">
                        {imgSrc ? (
                            <img src={imgSrc} alt={accessibleDescription} />
                        ) : (
                            <p>이미지를 선택하세요</p>
                        )}
                    </div>
                    <div className="alt-text">
                        <h3>Output</h3>
                        <p>{accessibleDescription}</p>
                    </div>
                </div>
            </div>

            <div className="section">
                <h2 className="subtitle">안내 음성 옵션을 설정해 보세요</h2>
                <TTSOptions altText={accessibleDescription} />
            </div>
        </div>
    );
}

export default Popup;
