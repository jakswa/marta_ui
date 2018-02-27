import StationList from './StationList/StationList';
import StationView from './StationView/StationView';
import TrainView from './TrainView/TrainView';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => (
  <Router>
    <div>
      <h1>marta.io</h1>
      <Route exact path="/" component={StationList} />
      <Route path="/station/:station" component={StationView} />
      <Route path="/train/:train_id" component={TrainView} />
    </div>
  </Router>
);

export default App;
