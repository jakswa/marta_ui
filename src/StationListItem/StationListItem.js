import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import StationPills from '../StationPills/StationPills';
import Stations from '../marta/stations';

class StationListItem {
  static render(stationName, arrivalData) {
    let link = "/station/" + stationName.replace(/ /g, '-');
    return (
      <ListItem divider key={stationName} component={Link} to={link}>
        <ListItemText className="station-list-title" primary={stationName.replace(/ station$/i, '')} />
        {this.renderPills(arrivalData)}
      </ListItem>
    );
  }

  static renderPills(arrivalData) {
    if (!arrivalData) return StationPills.blankPills();
    var res = [];
    for(var i = 0; i < 4; i++) {
      var dir = Stations.DIRS[i];
      var d = arrivalData[dir];
      if (!d) continue;
      res.push(
        <StationPills key={dir + d.line}
          dir={dir} desc={d.desc} time={d.time}
          line={d.line} />
      );
    }
    return res;
  }
}

export default StationListItem;
