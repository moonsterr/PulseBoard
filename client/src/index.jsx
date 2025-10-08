import App from './app';
import React from 'react';
import ReactDom from 'react-dom/client';
import { StrictMode } from 'react';
import './style.css';

ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App></App>
  </StrictMode>
);
