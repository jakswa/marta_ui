// npm packages
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import App from './App';
import { AppTheme } from './theme/types/types';
 // Service Worker
import registerServiceWorker from './registerServiceWorker';

function Root() {
  const [theme, setTheme] = React.useState(AppTheme.LIGHT);
  const toggleTheme = () => {
    setTheme(theme === AppTheme.LIGHT ? AppTheme.DARK: AppTheme.LIGHT)
  }
  return (
    <App toggleTheme={toggleTheme} theme={theme}/>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
registerServiceWorker();
