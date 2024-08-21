// SumComponent.js
import React, { useState, useEffect } from 'react';

function SumComponent() {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('https://www.drinkguide.store/summarize-html', {
          method: 'POST',  // POST 메서드로 변경
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: window.location.href  // 예시: 현재 페이지의 URL을 서버에 전달
          }),
        });

        const data = await response.json();
        console.log("Fetched summary:", data.summary);  // 서버에서 받아온 요약문 확인
        setSummary(data.summary || '요약 텍스트를 가져올 수 없습니다.');
      } catch (error) {
        console.error('Error fetching summary:', error);
        setSummary('요약 텍스트를 가져올 수 없습니다.');
      }
    }

    fetchSummary();
  }, []);

  return { summary };
}

export default SumComponent;
