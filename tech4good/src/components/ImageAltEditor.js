import React, { useState } from 'react';
import '../App.css';

function ImageAltEditor({ onGenerateAltText }) {
  const [altText, setAltText] = useState('여기에 생성된 대체 텍스트가 표시됩니다.');

  const handleGenerateAltText = () => {
    // AI API 호출하여 대체 텍스트를 생성하는 로직을 여기에 추가
    const generatedText = 'AI로부터 생성된 대체 텍스트입니다.';
    setAltText(generatedText);

    // 부모 컴포넌트로 생성된 텍스트 전달
    onGenerateAltText(generatedText);
  };

  return (
    <div className="section">
      <h2>이미지 대체 텍스트 편집기</h2>
      <button onClick={handleGenerateAltText}>대체 텍스트 생성</button>
      <textarea
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        rows="4"
      />
    </div>
  );
}

export default ImageAltEditor;
