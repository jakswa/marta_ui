import React, { Component } from 'react';
import Api from '../marta/api';

class StationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainID: props.match.params.train_id,
      arrivals: []
    };
  }

  componentDidMount() {
    // TODO: need more than just next two arrivals
    this.subscribeCallback = (arrivals) => {
      var matching = []
      for(var i = 0; i < arrivals.length; i++) {
        var arrival = arrivals[i];
        if(arrival.TRAIN_ID === this.state.trainID) {
          matching.push(arrival);
        }
      }
      this.setState({ arrivals: matching });
    };
    Api.subscribe(this.subscribeCallback);
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscribeCallback);
  }

  render() {
    return <div className="TrainView">
             <h2>Train {this.state.trainID} {this.arrivals[0] && this.arrivals[0].DIRECTION}</h2>
             <ul>{this.arrivals()}</ul>
           </div>;
  }

  arrivals() {
    var res = [];
    for(var i = 0; i < this.state.arrivals.length; i++) {
      var arrival = this.state.arrivals[i];
      res.push(
        <li className={arrival.LINE} key={arrival.TRAIN_ID}>
          {arrival.STATION.toLowerCase()} {arrival.WAITING_TIME}
        </li>
      );
    }
    return res;
  }
}

export default StationView;
