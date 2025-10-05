import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LoadingProvider } from './context/LoadingContext.jsx'; // <-- IMPORTE O PROVEDOR

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolva o App com o LoadingProvider */}
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </React.StrictMode>,
);