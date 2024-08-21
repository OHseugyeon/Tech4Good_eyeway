import { generateAltText } from './api.js';

let hoverTimeout;

// TTS로 대체 텍스트를 읽어주는 함수
function speakText(text) {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}

// 이미지에 마우스를 올렸을 때 팝업창에 이미지와 대체 텍스트를 표시하는 함수
async function showImageInPopup(event) {
  const image = event.target;
  
  hoverTimeout = setTimeout(async () => {
    const altText = await generateAltText(image);

    // TTS 기능으로 대체 텍스트 읽기
    console.log('TTS speaking:', altText);
    speakText(altText);
    
    // 팝업 창으로 이미지와 대체 텍스트 전달
    chrome.runtime.sendMessage({
      accessibleDescription: altText,
      imgSrc: image.src
    });
  }, 500); // 마우스를 올린 지 500ms 후에 팝업을 표시하도록 설정
}

// 이미지에서 마우스가 벗어났을 때 타임아웃을 제거하는 함수
function hideImageFromPopup(event) {
  clearTimeout(hoverTimeout);
}

// 이미지 태그에 이벤트 리스너 추가 함수
function addImageHoverListeners(context = document) {
  const images = context.querySelectorAll('img');
  images.forEach(image => {
    // 중복 리스너 추가 방지
    if (!image.dataset.listenerAdded) {
      console.log('Adding listener to image:', image.src);
      image.addEventListener('mouseenter', showImageInPopup);
      image.addEventListener('mouseleave', hideImageFromPopup);
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
      // Check if we can access the iframe's document
      if (iframeDocument && iframeDocument.location.origin === window.location.origin) {
        addImageHoverListeners(iframeDocument);
      }
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
