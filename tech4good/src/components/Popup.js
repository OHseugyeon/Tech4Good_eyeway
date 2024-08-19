import React, { useState, useEffect } from 'react';
import TTSOptions from './TTSOptions';
import '../App.css';

function Popup() {
  const [generatedAltText, setGeneratedAltText] = useState('여기에 생성된 대체 텍스트가 표시됩니다.');
  const [imageSrc, setImageSrc] = useState('placeholder-image.png'); // 기본 이미지

  // 대체 텍스트를 업데이트하는 함수
  const handleAltTextUpdate = (altText, imgSrc) => {
    setGeneratedAltText(altText);
    setImageSrc(imgSrc);
  };

  useEffect(() => {
    // 메시지를 통해 이미지 URL과 대체 텍스트를 받아옵니다.
    chrome.runtime.onMessage.addListener((request) => {
      if (request.altText && request.imgSrc) {
        handleAltTextUpdate(request.altText, request.imgSrc);
      }
    });
  }, []);

  return (
    <div className="popup-container">
      <div className="header">
        <h1 className="title">AltVision</h1>
        <button className="close-button" onClick={() => window.close()}>✖</button>
      </div>

      <hr className="divider" />

      <div className="section">
        <h2 className="subtitle">생성된 대체 텍스트를 확인하세요</h2>
        <div className="image-placeholder">
          <div className="image">
            <img src={imageSrc} alt="대체 텍스트가 생성된 이미지" />
          </div>
          <div className="alt-text">
            <h3>{generatedAltText}</h3>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="subtitle">안내 음성 옵션을 설정해 보세요</h2>
        <TTSOptions altText={generatedAltText} />
      </div>
    </div>
  );
}

export default Popup;
