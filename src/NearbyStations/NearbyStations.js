import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import StationListItem from '../StationListItem/StationListItem';
import Marta from '../marta';
import Api from '../marta/api';
import Location from '../location';
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
    Api.subscribe(this.subscribeCallback);
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

    list.push(<ListSubheader key="nearHead"><Switch checked={this.state.visible} onClick={this.toggleVisible.bind(this)} />Nearest Stations</ListSubheader>);

    if(this.state.location && this.state.visible) {
      var nearest = Marta.stationsNearest(
        this.state.location.latitude,
        this.state.location.longitude
      );

      for(var i = 0; i < 3; i++) {
        var stationName = nearest[i];
        var arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];
        list.push(StationListItem.render(stationName, arrivalData));
      }
    }
    return <ListItem><List>{list}</List></ListItem>;
  }
}

export default NearbyStations;
