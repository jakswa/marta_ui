import React, { Component } from 'react';
import Api from '../marta/api';
import Stations from '../marta/stations';
import StationPills from '../StationPills/StationPills';
import Location from '../location';
import { Link } from 'react-router-dom';
import Marta from '../marta';
import './StationList.css';

class StationList extends Component {
  static arrivals = {};
  constructor(props) {
    super(props);
    this.state = {
      stationNames: Stations.NAMES.slice(0),
      location: Location.cachedLocation()
    };
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

  // On first prompt, this requires user interaction to successfully ask the user.
  // After they click 'yes', you can request this on page load and get the location.
  getLocation() {
    Location.getLocation().then((coords) => {
      this.setState({
        location: { latitude: coords.latitude, longitude: coords.longitude }
      });
    }).catch((err) => {
      this.setState({ locFailed: true });
      console.log("error getting location:", err.message);
    });
  }

  render() {
    var list = [];

    if(!this.state.location && !this.state.locFailed) {
      list.push(
        <li key="locReq">
          <a onClick={this.getLocation.bind(this)}>Show nearest 3 stations?</a>
        </li>
      );
    }

    if(this.state.location) {
      var nearest = Marta.stationsNearest(
        this.state.location.latitude,
        this.state.location.longitude
      );

      for(var i = 0; i < 3; i++) {
        var stationName = nearest[i];
        var arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];
        list.push(
          <li key={"loc-" + stationName}>
            <Link to={"/station/" + stationName.replace(/ /g, '-')}>
              {stationName}
              {this.renderPills(arrivalData)}
            </Link>
          </li>
        );
      }
      list.push(<hr key="divider" />);
    }

    for(i = 0; i < this.state.stationNames.length; i++) {
      stationName = this.state.stationNames[i];
      arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];

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
