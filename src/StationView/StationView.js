import React, { Component } from 'react';
import Api from '../marta/api';
import StarredStations from "../StarredStations/StarredStations";
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';

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
        <AppBar position="static" color='primary' elevation={0}>
          <Toolbar>
            <IconButton onClick={this.goBack} color="default"><Icon style={{color: 'white'}}>arrow_back</Icon></IconButton>
            <Typography variant="h6" color="inherit">
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
    if (this.state.arrivals.length === 0) {
      return (
        <ListItem divider key="empty">
          <ListItemText primary="No data available" />
        </ListItem>
      )
    }
    var res = [];
    for(var i = 0; i < this.state.arrivals.length; i++) {
      var arrival = this.state.arrivals[i];
      var className = arrival.LINE + "Line";
      res.push(
        <ListItem button divider key={arrival.TRAIN_ID} component={Link} to={"/train/" + arrival.TRAIN_ID}>
          <Chip classes={{ root: className }} avatar={<Avatar className="Badge">{arrival.DIRECTION}</Avatar>} label={arrival.DESTINATION} />
          <Box mx={2}><ListItemText primary={arrival.WAITING_TIME} /></Box>
        </ListItem>
      );
    }
    return res;
  }
}

export default StationView;
