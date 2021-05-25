// npm packages
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import UpdateNotify from './UpdateNotify/UpdateNotify';

// Components
import App from './App';

function Root() {
  return (
    <App />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
serviceWorkerRegistration.register({
  onUpdate: () => {
    ReactDOM.render(<UpdateNotify />, document.getElementById('update-notify'));
  }
});
