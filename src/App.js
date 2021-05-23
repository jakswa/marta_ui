import StationList from './StationList/StationList';
import StationView from './StationView/StationView';
import TrainView from './TrainView/TrainView';
import Settings from './settings';
import React, { Component, Suspense, lazy } from "react";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// CSS
import { MuiThemeProvider } from "@material-ui/core/styles";
import ThemeManager from './theme/manager';
import { CssBaseline } from '@material-ui/core';

import BusRouteList from './BusRouteList';
const BusView = lazy(() => import('./BusView'));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { darkTheme: Settings.get('darkTheme') };
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={ThemeManager.cachedTheme()}>
          <div className={ThemeManager.current()}>
            <CssBaseline />
            <Grid container justify="center" spacing={0}>
              <Grid item xs={12} xl={4}>
                <Suspense fallback={<div>Loading...</div>}>
                  <Switch>
                    <Route exact path="/" component={StationList} />
                    <Route path="/station/:station" component={StationView} />
                    <Route path="/train/:train_id" component={TrainView} />
                    <Route path="/bus_routes/:route_id" component={BusView} />
                    <Route path="/bus_routes" component={BusRouteList} />
                  </Switch>
                </Suspense>
              </Grid>
            </Grid>
          </div>
        </MuiThemeProvider>
      </Router>
    )
  }
};

export default App;
