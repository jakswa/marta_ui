import React, { Component } from 'react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Switch from 'material-ui/Switch';
import { Link } from 'react-router-dom';
import Marta from '../marta';
import Api from '../marta/api';
import Stations from '../marta/stations';
import Location from '../location';
import StationPills from '../StationPills/StationPills';
import Settings from '../settings';

class NearbyStations extends Component {

  constructor(props) {
    super(props);
    this.state = {
      arrivals: Api.arrivalsByStation(),
      visible: Settings.get('nearbyVisible')
    };

    if (this.state.visible) {
      Location.getLocation().then((loc) => {
        this.setState({ location: loc });
      });
    }

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

  toggleVisible() {
    Settings.toggle('nearbyVisible');
    // if showing for the first time
    if(!this.state.visible && !this.state.location) {
      Location.getLocation().then((loc) => {
        this.setState({ location: loc });
      });
    }

    this.setState({ visible: !this.state.visible });
  }

  render() {
    var list = [];

    list.push(<ListSubheader key="nearHead"><Switch checked={this.state.visible} onClick={this.toggleVisible.bind(this)} /> Nearest Stations</ListSubheader>);

    if(this.state.location && this.state.visible) {
      var nearest = Marta.stationsNearest(
        this.state.location.latitude,
        this.state.location.longitude
      );

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
    return <ListItem><List>{list}</List></ListItem>;
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

export default NearbyStations;
