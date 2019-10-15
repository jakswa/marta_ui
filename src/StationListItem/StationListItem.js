import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import StationPills from '../StationPills/StationPills';
import Stations from '../marta/stations';

class StationListItem {
  static render(stationName, arrivalData) {
    let link = "/station/" + stationName.replace(/ /g, '-');
    const arrivals = this.arrivalsByDirection(arrivalData, stationName);

    return (
      <ListItem divider button key={stationName} component={Link} to={link}>
        <ListItemText className="station-list-title" primary={stationName.replace(/ station$/i, '')} />
        <div className="ContainerStationPills">{this.renderPills(arrivals)}</div>
      </ListItem>
    );
  }

  static renderPills(arrivalData) {
    if (!arrivalData) return StationPills.blankPills();

    return arrivalData.map((train) =>
      <StationPills key={train.id + train.stationName}
        dir={train.direction}
        desc={train.desc}
        time={train.time}
        line={train.line} />
    );
  }

  /**
   * Tranform arrivals into an array, sorted by the direction, augmented with direction and station name
   */
  static arrivalsByDirection(arrivalData, stationName) {
    if (arrivalData) {
      const orderedDirections = Stations.DIRS;
      const orderedArrivals = [];
      orderedDirections.forEach((d) => {
        if (arrivalData[d]) {
          arrivalData[d].direction = d;
          arrivalData[d].stationName = stationName;
          orderedArrivals.push(arrivalData[d]);
        }
      });

      return orderedArrivals;
    }
  }
}

export default StationListItem;
