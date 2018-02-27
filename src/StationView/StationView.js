import React, { Component } from 'react';
import Api from '../marta/api';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';

class StationView extends Component {
  constructor(props) {
    super(props);
    var name = this.props.match.params.station.replace(/-/g, " ");
    this.state = {
      stationName: name,
      upperStationName: name.toUpperCase(),
      arrivals: []
    };
  }

  componentDidMount() {
    this.subscribeCallback = (arrivals) => {
      var matching = []
      for(var i = 0; i < arrivals.length; i++) {
        var arrival = arrivals[i];
        if(arrival.STATION === this.state.upperStationName) {
          matching.push(arrival);
        }
      }
      this.setState({ arrivals: matching });
    };
    Api.subscribe(this.subscribeCallback);
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscribeCallback);
  }

  render() {
    return (
      <div className="StationView">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              {this.state.stationName}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>{this.arrivals()}</List>
      </div>
    )
  }

  arrivals() {
    var res = [];
    for(var i = 0; i < this.state.arrivals.length; i++) {
      var arrival = this.state.arrivals[i];
      var className = arrival.LINE + "Line";
      res.push(
        <ListItem divider key={arrival.TRAIN_ID} component={Link} to={"/train/" + arrival.TRAIN_ID}>
          <Chip classes={{ root: className }}  avatar={<Avatar>{arrival.DIRECTION}</Avatar>} label={arrival.DESTINATION} />
          <ListItemText primary={arrival.WAITING_TIME} />
        </ListItem>
      );
    }
    return res;
  }
}

export default StationView;
