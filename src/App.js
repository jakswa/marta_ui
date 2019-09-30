import StationList from './StationList/StationList';
import StationView from './StationView/StationView';
import TrainView from './TrainView/TrainView';
import React from "react";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter as Router, Route } from "react-router-dom";
// CSS
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import  AppThemeOptions  from './theme/theme'
import { Switch, CssBaseline } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const App = ({ toggleTheme, theme }) => {
  
  const storedTheme = createMuiTheme(AppThemeOptions[theme]);
  const handleChange = event => {
    console.log('createing mui theme to ',theme );
    toggleTheme(!theme)
  }
  return (
  <Router>
    <MuiThemeProvider theme={storedTheme}>
      <CssBaseline/>
    <Grid container justify="center" spacing={0}>
      <Grid item xs={12} xl={4}>
      <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="title" color="inherit">
              Stations
            </Typography>
            <Switch onChange={handleChange}/>
          </Toolbar>
        </AppBar>

        <Route exact path="/" render={()=><StationList theme={theme}/>}/>
        <Route path="/station/:station" component={StationView} />
        <Route path="/train/:train_id" component={TrainView} />
      </Grid>
    </Grid>
    </MuiThemeProvider>
  </Router>
  )
};

export default App;
