// src/api.js
export async function generateAltText(image) {
  try {
    const response = await fetch('https://drinkguide.store/generate-alt-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: image.src }),
    });

    const data = await response.json();
    console.log(data.altText);
    
    // 팝업 창에 이미지와 대체 텍스트를 전달
    chrome.runtime.sendMessage({
      accessibleDescription: data.altText || '대체 텍스트를 생성할 수 없습니다.',
      imgSrc: image.src
    });

    return data.altText || '대체 텍스트를 생성할 수 없습니다.';
  } catch (error) {
    console.error('Error generating alt text:', error);
    return '대체 텍스트를 생성할 수 없습니다.';
  }
}
