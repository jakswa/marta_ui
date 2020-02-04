import React, { Component } from "react";
import Api from './marta/api';
import Schedule from './marta/schedule';

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
    this.stopName = this.props.match.params.stop_name;
    this.schedulePromise = Schedule.forStop(this.stopName);
    this.subscribeCallback = (buses) => {
      this.processBuses(buses);
    };

    this.state = { busMap: {} };
  }

  async processBuses(busList) {
    let schedule = await this.schedulePromise;
    let now = new Date();
    let nowStr = new Date(now.getTime() - 600 * 1000)
      .toString().match(/\d{2}:\d{2}:\d{2}/)[0];

    let busMap = {};
    var serviceID;
    var futureBuses = busList.map((bus) => {
      var arriveInd;
      let ind = schedule.findIndex((sched) => {
        if (serviceID && sched.service_id !== serviceID) return false;
        arriveInd = sched.trip_ids.indexOf(bus.TRIPID);
        return arriveInd >= 0;
      });
      if (!serviceID && ind >= 0) {
        serviceID = schedule[ind].service_id;
      }

      if (ind >= 0) {
        let sched = schedule[ind];
        let arrival = sched.arrival_times[arriveInd];
        if (arrival > nowStr) {
          busMap[bus.TRIPID] = [bus, sched, arrival];
        }
      }
    });
    this.setState({ busMap: busMap });
  }

  componentDidMount() {
    Api.subscribe(this.subscribeCallback, 'buses');
  }

  componentWillUnmount() {
    Api.unsubscribe(this.subscribeCallback, 'buses');
  }

  static timingText(adherence) {
    if (adherence == 0) return "on time";
    let lateEarly = adherence < 0 ? 'late' : 'early';
    return `${Math.abs(adherence)} min ${lateEarly}`;
  }

  render() {
    let list = [];
    list.push(<ListSubheader key="busbus">Buses</ListSubheader>);

    for (let tripID in this.state.busMap) {
      let busAndSched = this.state.busMap[tripID];
      let bus = busAndSched[0];
      let sched = busAndSched[1];
      let headsign = sched.trip_headsign || `Route ${bus.ROUTE} ${sched.route_long_name}`;
      let primaryText = `${headsign} - ${BusView.timingText(bus.ADHERENCE)} for arrival at ${busAndSched[2]}`;
      let secondaryText = `(Trip ID: ${bus.TRIPID}) (${bus.TIMEPOINT} @ ${bus.MSGTIME})`;
      list.push(
        <ListItem divider key={bus.TRIPID}>
          <ListItemText primary={primaryText} secondary={secondaryText} />
        </ListItem>
      );
    }
    // no items :(
    if (list.length === 1) {
      list.push(<ListItem>No data, sorry</ListItem>);
    }

    return (
      <div className="BusList">
        <AppBar position="static" color="primary" elevation={0} >
          <Toolbar>
            <Typography variant="h6" color="inherit">
              {this.stopName}
            </Typography>
          </Toolbar>
        </AppBar>
        <List className="BusListHolder">{list}</List>
      </div>
    );
  }
}
