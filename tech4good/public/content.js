let hoverTimeout;

// 이미지의 대체 텍스트를 생성하는 함수
async function generateAltText(image) {
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

// 확장 프로그램의 메시지를 안전하게 전송하는 함수
function safeSendMessage(message) {
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(message, response => {
        if (chrome.runtime.lastError) {
          console.error('Failed to send message:', chrome.runtime.lastError);
        }
      });
    } else {
      console.error('chrome.runtime or sendMessage is not available.');
    }
  } catch (err) {
    console.error('Error during message sending:', err);
  }
}

// 이미지 위에 마우스를 올렸을 때 처리하는 함수
function handleMouseOver(event) {
  const image = event.target;
  if (image.tagName.toLowerCase() === 'img') {
    hoverTimeout = setTimeout(async () => {
      const altText = await generateAltText(image);

      // 생성된 대체 텍스트와 이미지 URL을 팝업으로 전송
      safeSendMessage({ altText, imgSrc: image.src });

      // TTS 기능으로 대체 텍스트 읽기
      const msg = new SpeechSynthesisUtterance(altText);
      window.speechSynthesis.speak(msg);
    }, 1000); // 1초 동안 머문 경우에만 대체 텍스트 생성
  }
}

// 이미지 위에서 마우스를 뗐을 때 처리하는 함수
function handleMouseOut() {
  clearTimeout(hoverTimeout);
}

// aria-hidden 속성을 가진 요소의 포커스 방지
document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
  el.setAttribute('tabindex', '-1');
});

// 이미지 요소에 마우스 오버 및 아웃 이벤트 리스너 추가
function addImageHoverListeners() {
  const images = document.querySelectorAll('img');
  images.forEach(image => {
    image.addEventListener('mouseover', handleMouseOver);
    image.addEventListener('mouseout', handleMouseOut);
  });
}

// 페이지 로드 시 이미지에 이벤트 리스너 추가
window.addEventListener('load', addImageHoverListeners);
