import React, { Component } from 'react';
import Api from '../marta/api';
import Stations from '../marta/stations';
import StationPills from '../StationPills/StationPills';
import Location from '../location';
import { Link } from 'react-router-dom';
import Marta from '../marta';
import './StationList.css';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';

class StationList extends Component {
  static arrivals = {};
  static dirs = ['N', 'S', 'W', 'E'];
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
        <ListItem button key="locReq" onClick={this.getLocation.bind(this)} >
          <ListItemText primary="Show nearest 3 stations?" />
        </ListItem>
      );
    }

    if(this.state.location) {
      var nearest = Marta.stationsNearest(
        this.state.location.latitude,
        this.state.location.longitude
      );

      list.push(<ListSubheader key="nearHead" disableSticky>Nearest Stations</ListSubheader>);
      for(var i = 0; i < 3; i++) {
        var stationName = nearest[i];
        var arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];
        list.push(
          <ListItem divider key={"loc-" + stationName} component={Link} to={"/station/" + stationName.replace(/ /g, '-')}>
            <ListItemText primary={stationName.replace(/ station$/i, '')} />
            {this.renderPills(arrivalData)}
          </ListItem>
        );
      }
    }

    list.push(<ListSubheader key="allHead" disableSticky>All Stations</ListSubheader>);
    for(i = 0; i < this.state.stationNames.length; i++) {
      stationName = this.state.stationNames[i];
      arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];

      list.push(
        <ListItem divider key={stationName} button component={Link} to={"/station/" + stationName.replace(/ /g, '-')}>
          <ListItemText primary={stationName.replace(/ station$/i, '')} />
          {this.renderPills(arrivalData)}
        </ListItem>
      );
    }
    // TODO test out 'dense' on the List, when we get chips in
    return (
      <div className="StationList">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Stations
            </Typography>
          </Toolbar>
        </AppBar>
        <List className="StationList">{list}</List>
      </div>
    );
  }

  renderPills(arrivalData) {
    if (!arrivalData) return;
    var res = [];
    for(var i = 0; i < 4; i++) {
      var dir = StationList.dirs[i];
      var d = arrivalData[dir];
      if (!d) continue;
      res.push(<StationPills key={dir + d.line} dir={dir} time={d.time} line={d.line} />);
    }
    return res;
  }
}

export default StationList;
