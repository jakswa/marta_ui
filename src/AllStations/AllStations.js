import React, { Component } from 'react';
import List, { ListItem, ListSubheader } from 'material-ui/List';
import Switch from 'material-ui/Switch';
import Api from '../marta/api';
import Stations from '../marta/stations';
import Settings from '../settings';
import StationListItem from '../StationListItem/StationListItem';

class AllStations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationNames: Stations.NAMES.slice(0),
      arrivals: Api.arrivalsByStation(),
      hideAll: Settings.get('hideAll')
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

  toggleVisible() {
    Settings.toggle('hideAll');
    this.setState({ hideAll: !this.state.hideAll });
  }

  render() {
    var list = [];
    list.push(<ListSubheader key="allHead"><Switch checked={!this.state.hideAll} onClick={this.toggleVisible.bind(this)} />All Stations</ListSubheader>);


    if (!this.state.hideAll) {
      for(var i = 0; i < this.state.stationNames.length; i++) {
        var stationName = this.state.stationNames[i];
        var arrivalData = this.state.arrivals && this.state.arrivals[stationName.toUpperCase()];
        list.push(StationListItem.render(stationName, arrivalData));
      }
    }
    return <ListItem key="allStations"><List>{list}</List></ListItem>;
  }
}

export default AllStations;
