import React, { Component } from 'react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Hidden from 'material-ui/Hidden';
import Api from '../marta/api';
import Stations from '../marta/stations';
import StationPills from '../StationPills/StationPills';
import { Link } from 'react-router-dom';
import Settings from '../settings';

class StarredStations extends Component {
  static _stars = Settings.get('stars') || {};

  /*** external api for other components to use ***/
  static stars() {
    var i = [];
    for(var j in this._stars) {
      i.push(j);
    }
    return i;
  }

  static isStarred(stationName) {
   return  !!this._stars[stationName];
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
    Api.subscribe(this.subscribeCallback, !!this.state.arrivals);
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscribeCallback);
  }

  render() {
    var list = [];

    list.push(<ListSubheader key="starHead">Starred Stations</ListSubheader>);

    for(var i = 0; i < this.state.starredStations.length; i++) {
      var stationName = this.state.starredStations[i];
      var arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];
      list.push(
        <ListItem divider key={"star-" + stationName} component={Link} to={"/station/" + stationName.replace(/ /g, '-')}>
          <ListItemText primary={stationName.replace(/ station$/i, '')} />
          {this.renderPills(arrivalData)}
        </ListItem>
      );
    }

    return <Hidden xsUp={!this.state.starredStations.length}><ListItem><List>{list}</List></ListItem></Hidden>;
  }

  renderPills(arrivalData) {
    if (!arrivalData) return;
    var res = [];
    for(var i = 0; i < 4; i++) {
      var dir = Stations.DIRS[i];
      var d = arrivalData[dir];
      if (!d) continue;
      res.push(<StationPills key={dir + d.line} dir={dir} desc={d.desc} time={d.time} line={d.line} />);
    }
    return res;
  }
}

export default StarredStations;
