import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';

// if the app is running in standalone mode
const isStandalone = !window.__POWERED_BY_FEDERATION__;

const root = createRoot (document.getElementById ('root'));
root.render (
  <React.StrictMode>
    {isStandalone
      ? <Router>
          <App />
        </Router>
      : <App />}
  </React.StrictMode>
);
