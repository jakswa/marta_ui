import React, { Component } from 'react';
import Api from '../marta/api';
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

class StationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainID: props.match.params.train_id,
      arrivals: []
    };
  }

  componentDidMount() {
    // TODO: need more than just next two arrivals
    this.subscribeCallback = (arrivals) => {
      var matching = []
      for(var i = 0; i < arrivals.length; i++) {
        var arrival = arrivals[i];
        if(arrival.TRAIN_ID === this.state.trainID) {
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

  goBack() {
    window.history.back();
  }

  render() {
    return (
      <div className="TrainView">
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <IconButton onClick={this.goBack} color="default"><Icon style={{color: 'white'}}>arrow_back</Icon></IconButton>
            <Typography variant="h6" color="inherit">
              Train ID {this.state.trainID}
            </Typography>
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
        <ListItem button divider key={arrival.STATION}>
          <Chip classes={{ root: className }} avatar={<Avatar className='Badge'>{arrival.DIRECTION}</Avatar>} label={arrival.STATION.replace(/ station$/i, '')} />
          <ListItemText primary={arrival.WAITING_TIME} />
        </ListItem>
      );
    }
    return res;
  }
}

export default StationView;
