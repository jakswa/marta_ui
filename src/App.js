import React, { Component } from 'react';
import Api from './marta/api';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: {}
    };
  }

  componentDidMount() {
    this.subscriber = (arrivals) => {
      this.updateStations(arrivals);
    };
    Api.subscribe(this.subscriber)
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscriber);
  }

  updateStations(arrivals) {
    var stations = {};
    for(let i = 0; i < arrivals.length; i++) {
      var arr = arrivals[i];
      var station = stations[arr.STATION];
      if (!station) 
        station = stations[arr.STATION] = {};
      if (!station[arr.DIRECTION])
        station[arr.DIRECTION] = {
          time: arr.WAITING_SECONDS,
          id: arr.TRAIN_ID,
          line: arr.LINE
        }
    }
    this.setState({ stations: stations });
  }

  arrivalList() {
    var list = [];
    for(var stationName in this.state.stations) {
      var arr = this.state.stations[stationName];
      var dirs = [];
      for(var dir in arr) {
        dirs.push(<span key={stationName + dir} className={arr[dir].line}>{dir} {arr[dir].time}</span>);
      }
      list.push(
        <li key={stationName} className={arr.line}>
          {stationName}
          {dirs}
        </li>
      );
    }
    return list;
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>marta.io</h1>
        </header>
        <p>
          Here we go.
        </p>
        <ul>
          { this.arrivalList() }
        </ul>
      </div>
    );
  }
}

export default App;
