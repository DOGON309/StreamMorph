// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // react-dom/clientからインポート
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // createRootを使用
root.render(<App />);
