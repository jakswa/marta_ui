import StationList from './StationList/StationList';
import StationView from './StationView/StationView';
import TrainView from './TrainView/TrainView';
import React from "react";
import Grid from "material-ui/Grid";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => (
  <Router>
    <Grid container justify="center" spacing={0}>
      <Grid item xs={12} xl={4}>
        <Route exact path="/" component={StationList} />
        <Route path="/station/:station" component={StationView} />
        <Route path="/train/:train_id" component={TrainView} />
      </Grid>
    </Grid>
  </Router>
);

export default App;
