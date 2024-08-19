import React, { useState, useEffect } from 'react';

function TTSOptions({ altText }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const voiceList = synth.getVoices();
      setVoices(voiceList);

      if (voiceList.length > 0) {
        setSelectedVoice(voiceList[0]);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  const speakText = () => {
    if (!selectedVoice) {
      alert('음성을 선택해 주세요.');
      return;
    }

    const msg = new SpeechSynthesisUtterance(altText || "이것은 선택된 음성 설정으로 읽는 테스트 텍스트입니다.");
    msg.voice = selectedVoice;
    msg.rate = 1;
    msg.pitch = 1;

    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="tts-options">
      <label className="label">언어 및 성별</label>
      <select
        value={selectedVoice?.name || ''}
        onChange={(e) => setSelectedVoice(voices.find(voice => voice.name === e.target.value))}
        className="dropdown"
      >
        <option value="">음성을 선택하세요</option>
        {voices.map((voice, index) => (
          <option key={index} value={voice.name}>
            {voice.lang.includes('ko') ? (voice.name.includes('male') ? '한국어 - 남성' : '한국어 - 여성') :
             voice.lang.includes('en') ? (voice.name.includes('male') ? '영어 - 남성' : '영어 - 여성') :
             '언어 선택'}
          </option>
        ))}
      </select>

      <button onClick={speakText} className="tts-test-button">TTS 테스트</button>
    </div>
  );
}

export default TTSOptions;
