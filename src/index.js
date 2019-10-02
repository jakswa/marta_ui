// npm packages
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import App from './App';
 // Service Worker
import registerServiceWorker from './registerServiceWorker';

function Root() {
  return (
    <App />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
registerServiceWorker();
