import React, { Component } from 'react';
// import Api from './marta/api';
import StationList from './StationList/StationList';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: {}
    };
  }


  render() {
    return (
      <div className="App">
        <header>
          <h1>marta.io</h1>
        </header>
        <StationList />
      </div>
    );
  }
}

export default App;
