import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import List from 'material-ui/List';
import StarredStations from '../StarredStations/StarredStations';
import NearbyStations from '../NearbyStations/NearbyStations';
import AllStations from '../AllStations/AllStations';

class StationList extends Component {
  render() {
    var list = [];

    list.push(<StarredStations key="starredStations" />);
    list.push(<NearbyStations key="nearbyStations" />);
    list.push(<AllStations key="allStations" />);

    return (
      <div className="StationList">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Stations
            </Typography>
          </Toolbar>
        </AppBar>
        <List className="StationListHolder">{list}</List>
        <Paper elevation={0} style={{padding: '16px'}}>
            <Typography color="inherit">
              Made by Jake Swanson
            </Typography>
        </Paper>
      </div>
    );
  }
}

export default StationList;
