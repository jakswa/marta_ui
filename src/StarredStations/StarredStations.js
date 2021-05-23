import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Hidden from '@material-ui/core/Hidden';
import Api from '../marta/api';
import Stations from '../marta/stations';
import Settings from '../settings';
import StationListItem from '../StationListItem/StationListItem';

class StarredStations extends Component {
  static _stars = Settings.get('stars') || {};

  /*** external api for other components to use ***/
  static stars() {
    var i = [];
    for (var j in this._stars) {
      i.push(j);
    }
    return i;
  }

  static isStarred(stationName) {
    return !!this._stars[stationName];
  }

  static star(stationName) {
    this._stars[stationName] = true;
    this.saveStars();
  }

  static unstar(stationName) {
    delete this._stars[stationName];
    this.saveStars();
  }

  static toggle(stationName) {
    if (this._stars[stationName]) {
      this.unstar(stationName);
    } else {
      this.star(stationName);
    }
  }

  static saveStars() {
    Settings.set('stars', this._stars);
  }
  /*** end external api ***/

  constructor(props) {
    super(props);
    this.state = {
      starredStations: StarredStations.stars(),
      stationNames: Stations.NAMES.slice(0),
      arrivals: Api.arrivalsByStation()
    };

    this.subscribeCallback = (arrivals) => {
      this.setState({ arrivals: Api.arrivalsByStation() });
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

    list.push(<ListSubheader key="starHead">Starred Stations</ListSubheader>);

    for (var i = 0; i < this.state.starredStations.length; i++) {
      var stationName = this.state.starredStations[i];
      var arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];
      list.push(StationListItem.render(stationName, arrivalData));
    }

    return <Hidden xsUp={!this.state.starredStations.length}><ListItem><List>{list}</List></ListItem></Hidden>;
  }
}

export default StarredStations;
