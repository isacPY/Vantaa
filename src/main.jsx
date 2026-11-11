import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BagProvider } from './state/store';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BagProvider>
      <App />
    </BagProvider>
  </React.StrictMode>,
);
