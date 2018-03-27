import React, { Component } from 'react';
import Api from '../marta/api';
import StarredStations from "../StarredStations/StarredStations";
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemText } from 'material-ui/List';

class StationView extends Component {
  constructor(props) {
    super(props);
    var name = this.props.match.params.station.replace(/-/g, " ");
    this.state = {
      stationName: name,
      upperStationName: name.toUpperCase(),
      starred: StarredStations.isStarred(name),
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

  toggleStar() {
    StarredStations.toggle(this.state.stationName);
    this.setState({ starred: !this.state.starred });
  }

  starIcon() {
    return this.state.starred ? 'star' : 'star_border';
  }

  goBack() {
    window.history.back();
  }

  render() {
    return (
      <div className="StationView">
        <AppBar position="static" style={{backgroundColor: '#607D8B'}} elevation={0}>
          <Toolbar>
            <IconButton onClick={this.goBack} color="default"><Icon style={{color: 'white'}}>arrow_back</Icon></IconButton>
            <Typography variant="title" color="inherit">
              {this.state.stationName}
            </Typography>
            <IconButton onClick={this.toggleStar.bind(this)}><Icon style={{color: 'white'}}>{this.starIcon()}</Icon></IconButton>
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
