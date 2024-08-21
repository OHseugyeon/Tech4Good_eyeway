import React, { useState, useEffect } from 'react';
import '../App.css';
import TTSOptions from './TTSOptions';

function Popup() {
    const [accessibleDescription, setAccessibleDescription] = useState('여기에 생성된 접근성 설명이 표시됩니다.');

    useEffect(() => {
        // 메시지 리스너 설정
        const messageListener = (request) => {
            if (request.accessibleDescription && request.imgSrc) {
                setAccessibleDescription(request.accessibleDescription);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        // 컴포넌트 언마운트 시 메시지 리스너 제거
        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

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
                        <img src="icons/example_img.png" alt="접근성 설명이 생성된 이미지" />
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
