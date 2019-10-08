import StationList from './StationList/StationList';
import StationView from './StationView/StationView';
import TrainView from './TrainView/TrainView';
import Settings from './settings';
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter as Router, Route } from "react-router-dom";
// CSS
import { MuiThemeProvider } from "@material-ui/core/styles";
import ThemeManager from './theme/manager';
import { CssBaseline } from '@material-ui/core';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { darkTheme: Settings.get('darkTheme') };
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={ThemeManager.cachedTheme()}>
          <CssBaseline />
          <Grid container justify="center" spacing={0}>
            <Grid item xs={12} xl={4}>
              <Route exact path="/" component={StationList} />
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
