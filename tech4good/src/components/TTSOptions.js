import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../App.css';

const TTSOptions = forwardRef(({ altText }, ref) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const voiceList = synth.getVoices();
      const filteredVoices = voiceList.filter(voice =>
        (voice.lang.includes('ko') && (voice.name.includes('female') || voice.name.includes('male'))) ||
        (voice.lang.includes('en') && (voice.name.includes('female') || voice.name.includes('male')))
      );

      const uniqueVoices = [
        {
          lang: 'ko',
          name: '한국어 - 남성',
          voice: filteredVoices.find(v => v.lang.includes('ko') && v.name.toLowerCase().includes('male'))
        },
        {
          lang: 'ko',
          name: '한국어 - 여성',
          voice: filteredVoices.find(v => v.lang.includes('ko') && v.name.toLowerCase().includes('female'))
        },
        {
          lang: 'en',
          name: '영어 - 남성',
          voice: filteredVoices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('male'))
        },
        {
          lang: 'en',
          name: '영어 - 여성',
          voice: filteredVoices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('female'))
        }
      ].filter(item => item.voice);

      setVoices(uniqueVoices);
      if (uniqueVoices.length > 0) {
        setSelectedVoice(uniqueVoices[0].voice);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  const handleVolumeChange = (increment) => {
    setVolume(prevVolume => Math.max(0, Math.min(1, prevVolume + increment)));
  };

  const handleRateChange = (increment) => {
    setRate(prevRate => Math.max(0.5, Math.min(2, prevRate + increment)));
  };

  // TTS 실행 함수
  const speakText = (text) => {
    if (!selectedVoice) {
      alert('음성을 선택해 주세요.');
      return;
    }

    const msg = new SpeechSynthesisUtterance(text || "이것은 선택된 음성 설정으로 읽는 테스트 텍스트입니다.");
    msg.voice = selectedVoice;
    msg.volume = volume;
    msg.rate = rate;
    msg.pitch = pitch;

    window.speechSynthesis.speak(msg);
  };

  // 외부에서 speakText 함수를 호출할 수 있게 함
  useImperativeHandle(ref, () => ({
    speakText
  }));

  return (
    <div className="voice-select">
      <label>언어 및 성별</label>
      <div className="custom-select-container">
        <div className="custom-select">
          <select
            value={selectedVoice?.name || ''}
            onChange={(e) => setSelectedVoice(voices.find(voice => voice.name === e.target.value)?.voice)}
            className="custom-dropdown"
          >
            <option value="">음성을 선택하세요</option>
            {voices.map((voiceItem, index) => (
              <option key={index} value={voiceItem.name}>
                {voiceItem.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="slider-container">
        <label>음량</label>
        <div className="slider-controls">
          <button2 className="slider-button" onClick={() => handleVolumeChange(-0.1)}>
            <img src="icons/decrease_button.png" alt="Decrease volume" />
          </button2>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <button2 className="slider-button" onClick={() => handleVolumeChange(0.1)}>
            <img src="icons/increase_button.png" alt="Increase volume" />
          </button2>
        </div>
      </div>

      <div className="slider-container">
        <label>속도</label>
        <div className="slider-controls">
          <button2 className="slider-button" onClick={() => handleRateChange(-0.1)}>
            <img src="icons/decrease_button.png" alt="Decrease rate" />
          </button2>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
          <button2 className="slider-button" onClick={() => handleRateChange(0.1)}>
            <img src="icons/increase_button.png" alt="Increase rate" />
          </button2>
        </div>
      </div>

      <button onClick={() => speakText(altText)} className="tts-test-button">TTS 테스트</button>
    </div>
  );
});

export default TTSOptions;
