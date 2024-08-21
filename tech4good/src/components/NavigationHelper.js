import React from 'react';
import '../App.css';

function NavigationHelper() {
  const navigateImages = () => {
    console.log("이미지 탐색 중...");
  };

  return (
    <div className="section">
      <h2>탐색 도우미</h2>
      <button onClick={navigateImages}>이미지 탐색</button>
    </div>
  );
}

export default NavigationHelper;
