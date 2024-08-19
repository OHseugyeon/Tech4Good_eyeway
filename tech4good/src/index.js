import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('React 앱이 로드되고 있습니다...');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
