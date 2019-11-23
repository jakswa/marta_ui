// npm packages
import React, { Component } from 'react';
// Material UI
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
// API
import ApiBus from '../marta/api-bus';
import tempStopList from './temp-bus-list';


const styles = theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});


class BusRoot extends Component {

  // componentDidMount() {
  //   ApiBus.searchBusStops()
  // }

  // move to a helper file
  titleCase = (string) => {
    return string.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  stopList = tempStopList.map((stop) => {
    return (
      <ListItem button key={stop.stop_id}>
        {/* also need to figure out what to do with these irregular @ */}
        <ListItemText primary={this.titleCase(stop.stop_name)} />
        <Chip label={`Stop # ${stop.stop_id}`} />
      </ListItem>
    );
  })

  render() {
    const { classes } = this.props;
    return (
      <Container maxWidth="sm">
        <Box bgcolor="background.main">
          <AppBar position="static" color="primary" elevation={0} >
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Buses
            </Typography>
            </Toolbar>
          </AppBar>
          <Paper component="form" className={classes.root}>
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder="Search for your stop"
              inputProps={{ 'aria-label': 'search for your stop' }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton className={classes.iconButton} aria-label="favorite">
              <StarBorderIcon />
            </IconButton>
          </Paper>
          <List component="nav" aria-label="secondary mailbox folders">
            <ListItem button>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="MEMORIAL DR SE@STOVALL ST SE [104060]" />
            </ListItem>
          </List>
          <Divider />
          <List component="nav" aria-label="stops">
            {this.stopList}
          </List>
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles)(BusRoot);
