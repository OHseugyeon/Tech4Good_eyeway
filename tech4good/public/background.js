// background.js
console.log('Background script running');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'speak') {
      const msg = new SpeechSynthesisUtterance(message.text);
      window.speechSynthesis.speak(msg);
    }
  });