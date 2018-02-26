import React, { Component } from 'react';
import './StationPills.css';

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
    return <span className={"StationPills " + this.state.line}>{this.state.dir}{this.state.time}</span>;
  }
}

export default StationPills;
