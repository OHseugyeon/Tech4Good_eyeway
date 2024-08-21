import React, { useState } from 'react';
import { generateAltText } from '../api'; // generateAltText 함수가 정의된 파일로부터 가져옵니다.
import '../App.css';

function ImageComponent() {
  const [altText, setAltText] = useState('');

  const handleImageHover = (event) => {
    const image = event.target;
    if (image.tagName.toLowerCase() === 'img') {
      generateAltText(image).then(text => {
        setAltText(text);
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
      });
    }
  };

  return (
    <div>
      <img
        src="https://example.com/image.jpg"
        alt={altText}
        onMouseOver={handleImageHover}
      />
      <p>{altText}</p>
    </div>
  );
}

export default ImageComponent;
