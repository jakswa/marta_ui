import React, { Component } from 'react';
import Api from '../marta/api';
import AppBar from 'material-ui/AppBar';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';

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

  render() {
    return (
      <div className="TrainView">
        <AppBar position="static" style={{backgroundColor: '#607D8B'}} elevation={0}>
          <Toolbar>
            <Typography variant="title" color="inherit">
              Train ID {this.state.trainID}
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
        <ListItem divider key={arrival.STATION}>
          <Chip classes={{ root: className }}  avatar={<Avatar>{arrival.DIRECTION}</Avatar>} label={arrival.STATION.replace(/ station$/i, '')} />
          <ListItemText primary={arrival.WAITING_TIME} />
        </ListItem>
      );
    }
    return res;
  }
}

export default StationView;
