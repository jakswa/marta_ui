import React, { Component } from 'react';
import Api from '../marta/api';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// Timeline reqs
import Stations from '../marta/stations';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';

class StationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainID: props.match.params.train_id,
      arrivals: []
    };
  }

  componentDidMount() {
    this.subscribeCallback = (arrivals) => {
      var matching = []
      for (var i = 0; i < arrivals.length; i++) {
        var arrival = arrivals[i];
        if (arrival.TRAIN_ID === this.state.trainID) {
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
            <IconButton onClick={this.goBack} color="default"><Icon style={{ color: 'white' }}>arrow_back</Icon></IconButton>
            <Typography variant="h6" color="inherit">
              Train ID {this.state.trainID}
            </Typography>
          </Toolbar>
        </AppBar>
        <Timeline className={`${this.lineColor()}-line`}>{this.arrivals()}</Timeline>
      </div>
    )
  }

  lineColor() {
    if (this._lineColor) return this._lineColor;
    var nextArrival = this.state.arrivals[0];
    this._lineColor = nextArrival && nextArrival.LINE.toLowerCase();
    return this._lineColor;
  }

  trainDestination() {
    if (this._trainDestination) return this._trainDestination;
    var nextArrival = this.state.arrivals[0];
    this._trainDestination = nextArrival && nextArrival.DESTINATION.toLowerCase().replace(' station', '');
    return this._trainDestination;
  }

  // working around wonky API data flickering around here.
  // A priority is UI stability. We'll grow the list of stations as
  // they sit there reading, but we won't shrink it.
  // This means if they visit during flaky JSON, it might show 1 entry,
  // and if the API updates with 10 entries for the train, we'll flicker
  // jarringly to keep the UI accurate, and grow the list. If 20s later
  // the list shrinks back down to 1 entry, we will not shrink the list.
  updateLineStations() {
    var lineColor = this.lineColor();
    var line = lineColor && Stations.LINES[lineColor].slice();
    var nextArrival = this.state.arrivals[0];
    if (line && nextArrival && (nextArrival.DIRECTION === 'N' || nextArrival.DIRECTION == 'W')) {
      line.reverse();
    }
    var startInd = line && nextArrival && line.findIndex((station) => {
      return nextArrival.STATION.toLowerCase().indexOf(station) === 0;
    });
    if (line && startInd > -1) line = line.slice(startInd);
    if (line && (!this.lineStations || this.lineStations.length < line.length)) {
      this.lineStations = line;
    }
  }

  arrivals() {
    this.updateLineStations();
    var stations = this.lineStations;

    if (!stations) {
      return (
        <TimelineItem key="empty">
          <TimelineContent>
            <Typography>No data available</Typography>
          </TimelineContent>
        </TimelineItem>
      )
    }

    var res = [];
    for (var i = 0; i < stations.length; i++) {
      var station = stations[i];
      var arrival = this.state.arrivals.find((arr) => arr.STATION.toLowerCase().indexOf(station) > -1);
      res.push(
        <TimelineItem key={station}>
          <TimelineOppositeContent>
            <Typography>{station}</Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot>
            </TimelineDot>
            {this.connectorFor(i, stations.length)}
          </TimelineSeparator>
          <TimelineContent>
            {this.contentFor(arrival, station)}
          </TimelineContent>
        </TimelineItem>
      );
    }
    return res;
  }

  contentFor(arrival, station) {
    if (!arrival) return;

    if (station === this.trainDestination()) {
      return <Paper>
        <Typography variant="h6" component="h1">
          {arrival.WAITING_TIME}
        </Typography>
        <Typography>destination</Typography>
      </Paper>;
    }

    if (arrival === this.state.arrivals[0]) {
      return <Paper>
        <Typography variant="h6" component="h1">
          {arrival.WAITING_TIME}
        </Typography>
      </Paper>;
    }

    return <Typography>{arrival.WAITING_TIME}</Typography>;
  }

  connectorFor(i, len) {
    if (i < len - 1) {
      return <TimelineConnector />;
    }
  }
}

export default StationView;
