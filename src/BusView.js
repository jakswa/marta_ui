import React, { Component } from "react";
import Api from './marta/api';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default class BusView extends Component {
  constructor(props) {
    super(props);
    this.state = { buses: [] };
    this.subscribeCallback = (buses) => {
      this.setState({ buses: buses.reverse() });
    };
  }

  componentDidMount() {
    Api.subscribe(this.subscribeCallback, 'buses');
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscribeCallback, 'buses');
  }

  render() {
    let list = [];
    list.push(<ListSubheader key="busbus">Buses</ListSubheader>);

    for (let i = 0; i < this.state.buses.length; i++) {
      let bus = this.state.buses[i];
      list.push(
        <ListItem divider key={bus["TRIPID"]}>
          <ListItemText className="station-list-title" primary={bus["ROUTE"]} />
        </ListItem>
      );
    }

    return (
      <div className="BusList">
        <AppBar position="static" color="primary" elevation={0} >
          <Toolbar>
            <Typography variant="title" color="inherit">
              Buses
            </Typography>
          </Toolbar>
        </AppBar>
        <List className="BusListHolder">{list}</List>
      </div>
    );
  }
}
