import React, { Component } from 'react';
import Api from '../marta/api';
import Stations from '../marta/stations';
import StationPills from '../StationPills/StationPills';
import { Link } from 'react-router-dom';
import './StationList.css';

class StationList extends Component {
  static arrivals = {};
  constructor(props) {
    super(props);
    this.state = { stationNames: Stations.NAMES.slice(0) };
    this.subscribeCallback = (arrivals) => {
      this.setState({ arrivals: StationList.byStation(arrivals) });
    };
  }

  static byStation(arrivals) {
    var byStation = {};
    for(let i = 0; i < arrivals.length; i++) {
      var arr = arrivals[i];
      var station = byStation[arr.STATION];
      if (!station) {
        station = byStation[arr.STATION] = {};
      }
      if (!station[arr.DIRECTION]) {
        station[arr.DIRECTION] = {
          time: arr.WAITING_SECONDS,
          id: arr.TRAIN_ID,
          line: arr.LINE
        };
      }
    }
    return byStation;
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

          <Link to={"/station/" + stationName.replace(/ /g, '-')}>
            {stationName}
            {this.renderPills(arrivalData)}
          </Link>
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
