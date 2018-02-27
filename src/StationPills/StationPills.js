import React, { Component } from 'react';
import './StationPills.css';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

class StationPills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dir: props.dir,
      line: props.line,
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

  render() {
    var className = this.state.line + 'Line Pill';
    return <Chip classes={{root: className}} avatar={<Avatar>{this.state.dir}</Avatar>} label={':' + Math.ceil(this.state.time / 60)} />;
  }
}

export default StationPills;
