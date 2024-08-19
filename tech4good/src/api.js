// src/api.js
export async function generateAltText(image) {
  try {
    const response = await fetch('http://localhost:3000/generate-alt-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: image.src }),
    });

    const data = await response.json();
    return data.altText || '대체 텍스트를 생성할 수 없습니다.';
  } catch (error) {
    console.error('Error generating alt text:', error);
    return '대체 텍스트를 생성할 수 없습니다.';
  }
}
