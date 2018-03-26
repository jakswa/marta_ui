import React, { Component } from 'react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Switch from 'material-ui/Switch';
import { Link } from 'react-router-dom';
import Api from '../marta/api';
import Stations from '../marta/stations';
import StationPills from '../StationPills/StationPills';
import Settings from '../settings';

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

        list.push(
          <ListItem divider key={stationName} button component={Link} to={"/station/" + stationName.replace(/ /g, '-')}>
            <ListItemText primary={stationName.replace(/ station$/i, '')} />
            {this.renderPills(arrivalData)}
          </ListItem>
        );
      }
    }
    return <ListItem key="allStations"><List>{list}</List></ListItem>;
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

export default AllStations;
