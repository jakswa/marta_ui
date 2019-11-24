import React from 'react';
import ReactDOM from 'react-dom';

import './mocks/matchMedia.mock'; // Must be imported before the tested file
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
