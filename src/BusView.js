import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Api from './marta/api';

import mapboxgl from '!mapbox-gl';
import BusRouteList from './BusRouteList';
mapboxgl.accessToken = 'pk.eyJ1IjoiamFrc3dhIiwiYSI6ImNrb3l3MG95YjBwaXUyb213MnNtYnA4MWcifQ.RSsKLzKMN2h8xWBrLGs1gw';

class BusView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routeId: this.props.match.params.route_id,
            buses: []
        };
        this.markers = {};
        this.mapContainer = React.createRef();
        this.subscribeCallback = (arr) => {
            var buses = arr.filter((bus) => bus.ROUTE === this.state.routeId)
                .sort((i, j) => i.VEHICLE < j.VEHICLE ? -1 : 1);
            this.updateMap(buses);
            this.setState({ buses: buses });
        };
    }

    render() {
        return <div className="BusView">
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <IconButton onClick={this.goBack} color="default"><Icon style={{ color: 'white' }}>arrow_back</Icon></IconButton>
                    <Typography variant="h6" color="inherit">
                        Bus Route {this.state.routeId}
                    </Typography>
                </Toolbar>
            </AppBar>
            <div><div ref={this.mapContainer} className="map-container"></div></div>
            <link href='https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.css' rel='stylesheet' />
            <List>{this.busList()}</List>
        </div>;
    }

    timeliness(bus) {
        var adh = parseInt(bus.ADHERENCE);
        return adh === 0 ? 'on time' : (adh < 0 ? Math.abs(adh) + "min late" : adh + "min early");
    }
    busList() {
        return this.state.buses.map((bus) => {
            return <ListItem divider key={bus.VEHICLE}>
                <ListItemText>
                    <Typography variant="subtitle2">
                        {bus.DIRECTION} {bus.VEHICLE} was {this.timeliness(bus)} at {bus.TIMEPOINT} as of {bus.MSGTIME}
                    </Typography>
                    {this.subText(bus)}
                </ListItemText>
            </ListItem>;
        });
    }

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-84.3877881, 33.7489121],
            zoom: 10
        });
        Api.subscribe(this.subscribeCallback, 'buses');
    }

    subText(bus) {
        var changedAt = this.busPosChanges && this.busPosChanges[bus.VEHICLE];
        if (!changedAt) return;

        return <Typography variant="body2">
            Position was updated at {changedAt.toTimeString().split(' ')[0]}
        </Typography>;
    }

    updateMap(buses) {
        var bounds = new mapboxgl.LngLatBounds();
        var newMarker = false
        buses.forEach((bus) => {
            var lngLat = [parseFloat(bus.LONGITUDE), parseFloat(bus.LATITUDE)];
            bounds.extend(lngLat);
            var marker = this.markers[bus.VEHICLE];
            if (!marker) {
                newMarker = true;
                this.addMarker(bus, lngLat);
            } else {
                let oldLngLat = marker.getLngLat();
                if (oldLngLat.lng != lngLat[0] || oldLngLat.lat != lngLat[1]) {
                    this.positionChanged(bus);

                    marker.getElement().classList.add("old-pos");
                    this.addMarker(bus, lngLat);
                }
            }
        });
        if (newMarker) {
            this.map.fitBounds(bounds, { padding: 50, maxZoom: 16 });
        }
    }

    addMarker(bus, lngLat) {
        var dir = bus.DIRECTION.slice(0, 1);
        var timely = bus.ADHERENCE === '0' ? 'on-time' : (parseInt(bus.ADHERENCE) < 0 ? 'late' : 'early');
        var ele = document.createElement('span');
        ele.classList.add('material-icons', 'MuiIcon-root', 'bus-marker', 'bus-marker-' + dir, 'bus-marker-' + timely);
        if (dir === 'N')
            ele.innerHTML = 'arrow_drop_up_sharp';
        else if (dir === 'S')
            ele.innerHTML = 'arrow_drop_down_sharp';
        else if (dir === 'E')
            ele.innerHTML = 'arrow_right_sharp';
        else
            ele.innerHTML = 'arrow_left_sharp';
        this.markers[bus.VEHICLE] = new mapboxgl.Marker({ element: ele })
            .setLngLat(lngLat)
            .addTo(this.map);
    }

    positionChanged(bus) {
        if (!this.busPosChanges) this.busPosChanges = {};

        this.busPosChanges[bus.VEHICLE] = new Date();
    }

    componentWillUnmount() {
        Api.unsubscribe(this.subscribeCallback, 'buses');
    }


    goBack() {
        window.history.back();
    }
}

export default BusView;