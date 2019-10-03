import StationList from './StationList/StationList';
import StationView from './StationView/StationView';
import TrainView from './TrainView/TrainView';
import Settings from './settings';
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter as Router, Route } from "react-router-dom";
// CSS
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppThemeOptions from './theme/theme'
import { CssBaseline } from '@material-ui/core';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { darkTheme: Settings.get('darkTheme') };
  }

  theme() {
    return this.state.darkTheme ? 'dark' : 'light';
  }

  render() {
    const toggleTheme = () => {
      Settings.toggle('darkTheme');
      this.setState({ darkTheme: Settings.get('darkTheme') });
    }

    const theme = this.theme();
    const themeOpts = AppThemeOptions[theme];

    return (
      <Router>
        <MuiThemeProvider theme={createMuiTheme(themeOpts)}>
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
