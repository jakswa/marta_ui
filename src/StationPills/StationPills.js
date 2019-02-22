import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

const BLANK_CHIP = <Chip style={{opacity: 0.5}} label="NO DATA" />;

class StationPills extends Component {
  static blankPills() {
    return BLANK_CHIP;
  }

  constructor(props) {
    super(props);
    this.state = {
      dir: props.dir,
      line: props.line,
      desc: props.desc,
      time: props.time
    };
  }

  componentWillReceiveProps(nextProps) {
    var updates = {};
    for(var i in nextProps) {
      if(this.state[i] !== nextProps[i]) {
        updates[i] = nextProps[i];
      }
    }
    this.setState(updates);
  }

  timeDisplay() {
    if (this.state.desc.indexOf('Arriving') === 0) {
      return <Icon>train</Icon>;
    } else if(this.state.desc === 'Arrived' || this.state.desc === 'Boarding') {
      return <Icon className="rot90">publish</Icon>;
    }

    // NOTE: subtracting 30s because it looks like marta adds it to seconds
    // (pills use the seconds, station/train views use the "1 min" text,
    // and apparently they differ in their definition? somehow. thanks marta)
    var time = Math.floor((this.state.time - 30) / 60);

    // in my observations, "Arriving" appears at 90s mark (1min + 30s!)
    // so this shouldn't happen, but just in case
    if (time <= 0) {
      return <Icon>train</Icon>;
    }

    if (time < 10) {
      time = "0" + time;
    }
    return ':' + time;
  }

  render() {
    var className = this.state.line + 'Line Pill';
    return <Chip classes={{root: className}} avatar={<Avatar>{this.state.dir}</Avatar>} label={this.timeDisplay()} />;
  }
}

export default StationPills;
