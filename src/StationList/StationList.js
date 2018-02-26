import React, { Component } from 'react';
import Api from '../marta/api';
import Stations from '../marta/stations';
import StationPills from '../StationPills/StationPills';
import './StationList.css';

class StationList extends Component {
  static arrivals = {};
  constructor(props) {
    super(props);
    this.state = { stationNames: Stations.NAMES.slice(0) };
    this.subscribeCallback = (arrivalsByStation) => {
      this.setState({ arrivals: arrivalsByStation });
    };
  }

  componentDidMount() {
    Api.subscribe(this.subscribeCallback);
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscribeCallback);
  }

  render() {
    var list = [];
    for(var i = 0; i < this.state.stationNames.length; i++) {
      var stationName = this.state.stationNames[i];
      var arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];

      list.push(
        <li key={stationName}>
          {stationName}
          {this.renderPills(arrivalData)}
        </li>
      );
    }
    return <ul className="StationList">{list}</ul>;
  }

  renderPills(arrivalData) {
    var res = [];
    for(var dir in arrivalData) {
      var d = arrivalData[dir];
      res.push(<StationPills key={dir + d.line} dir={dir} time={d.time} line={d.line} />);
    }
    return res;
  }
}

export default StationList;
