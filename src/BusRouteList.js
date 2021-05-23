import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box'

import Api from './marta/api';

class BusRouteList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routeId: this.props.match.params.route_id
        };
        this.subscribeCallback = (_buses) => {
            this.setState({ busesByRoute: Api.busesByRoute() });
        };
    }

    render() {
        this.compareTime = new Date();
        return <div className="BusRouteList">
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <IconButton onClick={this.goBack} color="default"><Icon style={{ color: 'white' }}>arrow_back</Icon></IconButton>
                    <Typography variant="h6" color="inherit">
                        Bus Routes
                    </Typography>
                </Toolbar>
            </AppBar>
            <List>{this.renderRouteList()}</List>
        </div>;
    }

    goBack() {
        window.history.back();
    }


    renderRouteList() {
        var list = [];
        if (!this.state.busesByRoute) return list;

        for (var route in this.state.busesByRoute) {
            list.push(this.renderRouteBuses(route));
        }
        return list;
    }

    renderRouteBuses(route) {
        var routeLink = "/bus_routes/" + route;
        return <ListItem divider button key={route} component={Link} to={routeLink}>
            <Chip label={`Route ${route}`}></Chip> <Box>{this.renderBuses(route)}</Box>
        </ListItem>;
    }

    busesByFreshness(route) {
        var sorted = Object.values(this.state.busesByRoute[route]);
        sorted.sort((i, j) => {
            return i.msgDate < j.msgDate ? 1 : -1;
        });
        return sorted;
    }

    renderBuses(route) {
        return this.busesByFreshness(route).map((bus) => {
            var adherence = parseInt(bus.ADHERENCE);
            if (adherence === 0) {
                var timeliness = 'on-time';
                var timeIcon = <Icon>directions_bus</Icon>; // 'ON TIME'
            } else if (adherence < 0) {
                var timeliness = 'late';
                var timeIcon = <Icon>departure_board</Icon>
            } else {
                var timeliness = 'early';
                var timeIcon = <Icon>speed</Icon>
            }

            // 0 = fresh, 1 = 5min+ old, 2 = 10min+ old, etc
            var age = Math.floor((this.compareTime - bus.msgDate) / 600000);
            if (age > 2) age = 2;
            var classes = `age-${age} timely-${timeliness}`;
            var avatar = <Avatar>{timeIcon}</Avatar>;

            return <Chip className={classes} key={`chip-${bus.VEHICLE}`} avatar={avatar} label={bus.DIRECTION.slice(0, 1)}></Chip>;
        });
    }

    componentDidMount() {
        Api.subscribe(this.subscribeCallback, 'buses');
    }

    componentWillUnmount() {
        Api.unsubscribe(this.subscribeCallback);
    }
}

export default BusRouteList;