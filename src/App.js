import StationList from './StationList/StationList';
import StationView from './StationView/StationView';
import TrainView from './TrainView/TrainView';
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter as Router, Route } from "react-router-dom";
// CSS
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppThemeOptions from './theme/theme'
import { CssBaseline } from '@material-ui/core';


class App extends Component {
  render() {
    const { theme, toggleTheme } = this.props // drilling props( as we are not using Redux here or some state managment) for passing between components

    const storedTheme = createMuiTheme(AppThemeOptions[theme]); // Picking up selecting theme

    return (
      <Router>
        <MuiThemeProvider theme={storedTheme}>
          <CssBaseline />
          <Grid container justify="center" spacing={0}>
            <Grid item xs={12} xl={4}>
              <Route exact path="/" render={() => <StationList theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="/station/:station" component={StationView} />
              <Route path="/train/:train_id" component={TrainView} />
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </Router>
    )
  }
};

export default App;
