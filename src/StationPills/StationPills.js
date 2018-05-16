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
    } else {
      var time = Math.ceil(this.state.time / 60);
      if (time < 10) {
        time = "0" + time;
      }
      return ':' + time;
    }
  }

  render() {
    var className = this.state.line + 'Line Pill';
    return <Chip classes={{root: className}} avatar={<Avatar>{this.state.dir}</Avatar>} label={this.timeDisplay()} />;
  }
}

export default StationPills;
