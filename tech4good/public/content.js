let hoverTimeout;

// 이미지의 대체 텍스트를 AI로 생성하는 함수
async function generateAltText(image) {
  try {
    const response = await fetch('https://drinkguide.store/generate-alt-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: image.src }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.altText) {
      throw new Error('AI did not return alt text');
    }

    return data.altText;
  } catch (error) {
    console.error('Error generating alt text:', error);
    return '대체 텍스트를 생성할 수 없습니다.';
  }
}

// TTS로 대체 텍스트를 읽어주는 함수
function speakText(text) {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}

// 이미지 위에 마우스를 올렸을 때 처리하는 함수
async function handleMouseOver(event) {
  const image = event.target;
  if (image.tagName.toLowerCase() === 'img') {
    hoverTimeout = setTimeout(async () => {
      try {
        const altText = await generateAltText(image);

        // TTS 기능으로 대체 텍스트 읽기
        console.log('TTS speaking:', altText);
        speakText(altText);
      } catch (error) {
        console.error('Error in handleMouseOver:', error);
      }
    }, 1000); // 1초 동안 머문 경우에만 대체 텍스트 생성
  }
}

// 이미지 위에서 마우스를 뗐을 때 처리하는 함수
function handleMouseOut() {
  clearTimeout(hoverTimeout);
}

// 이미지 태그에 이벤트 리스너 추가 함수
function addImageHoverListeners(context = document) {
  const images = context.querySelectorAll('img');
  images.forEach(image => {
    // 중복 리스너 추가 방지
    if (!image.dataset.listenerAdded) {
      console.log('Adding listener to image:', image.src);
      image.addEventListener('mouseover', handleMouseOver);
      image.addEventListener('mouseout', handleMouseOut);
      image.dataset.listenerAdded = true; // 리스너 추가 플래그
    }
  });
}

// iframe 내부의 문서를 탐색하여 이벤트 리스너를 추가
function addListenersToIframes() {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      addImageHoverListeners(iframeDocument);
    } catch (e) {
      console.warn('Cannot access iframe contents:', e);
    }
  });
}

// 페이지 로드 시 이미지 및 iframe 내부 이미지에 이벤트 리스너 추가 및 동적 요소 감지
window.addEventListener('load', () => {
  addImageHoverListeners();
  addListenersToIframes();
  
  // MutationObserver를 사용하여 DOM 변화 감지 (동적으로 추가되는 img 태그에 대응)
  const observer = new MutationObserver(() => {
    addImageHoverListeners();
    addListenersToIframes();
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
