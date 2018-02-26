import React, { Component } from 'react';
import Api from '../marta/api';

class StationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationName: this.props.match.params.station.replace(/-/g, " ")
    };
  }

  componentDidMount() {
    // TODO: need more than just next two arrivals
    this.subscribeCallback = (arrivalsByStation) => {
      this.setState({ arrival: arrivalsByStation[this.state.stationName.toUpperCase()] });
    };
    Api.subscribe(this.subscribeCallback);
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscribeCallback);
  }

  render() {
    return <div className="StationView">
             <h1>{this.state.stationName}</h1>
             <ul>{this.arrivals()}</ul>
           </div>;
  }

  arrivals() {
    var res = [];
    for(var dir in this.state.arrival) {
      var info = this.state.arrival[dir];
      res.push(<li>{dir} {info.time} {info.direction}</li>);
    }
    return res;
  }
}

export default StationView;
