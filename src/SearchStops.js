import React, { Component } from "react";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';

export default class SearchStops extends Component {
  constructor(props) {
    super(props);
    this.state = { stopNames: [] };
  }
  scheduleSearch(_ev, msDelay) {
    if (msDelay == null) msDelay = 750;

    let searchbox = document.querySelector('#searchbox');
    let value = searchbox.value;
    if (!value || value.length < 3 || value === this.prevSearch) return;

    clearInterval(this.searchTimer);
    this.searchTimer = setTimeout(()=> {
      this.search(value);
    }, msDelay);
  }

  immediateSearch(ev) {
    if (ev.keyCode !== 13) return;
    this.scheduleSearch(ev, 0);
  }

  async search(partialName) {
    console.log(`here i am. ${partialName}`);
    let results = await fetch(`https://rust.marta.io/stops?name=${partialName}`)
      .then((res) => res.json());

    let names = results.map((stop) => stop.stop_name);
    this.setState({ stopNames: Array.from(new Set(names)) });
  }

  render() {
    let list = this.state.stopNames.map((name) => {
      return (<ListItem button divider key={name} component={Link} href={`/buses/${name}`}>
        <ListItemText className="station-name" primary={name} />
      </ListItem>);
    });
    return <div className="StopSearch">
        <AppBar position="static" color="primary" elevation={0} >
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Stop Search
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper className="bottom-links" elevation={0} style={{ display: 'flex', padding: '16px' }}>
          <TextField
            id="searchbox"
            onKeyUp={this.immediateSearch.bind(this)}
            onChange={this.scheduleSearch.bind(this)}
            label="stop name"
            type="search" />
        </Paper>
        <List className="NameListHolder">{list}</List>
      </div>;

  }
}
