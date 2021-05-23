// The interface from which each react component can receive
// train or bus updates. It would be much less code to just hit
// these HTTP endpoints a lot, but it's tens of KB each time so I'm
// putting effort into reducing waste for our mobile friends.

class Api {
  static INTERVALS = {
    trains: 10500,
    buses: 20500,
  };

  static URLS = {
    trains: 'https://api.marta.io/trains',
    buses: 'https://api.marta.io/buses'
  };

  // dataType: 'trains' or 'buses'
  static subscribe(callback, dataType) {
    if (!dataType) dataType = 'trains';
    return this.poller(dataType).subscribe(callback);
  }
  static unsubscribe(callback, dataType) {
    if (!dataType) dataType = 'trains';
    return this.poller(dataType).unsubscribe(callback);
  }

  static poller(dataType) {
    if (!this.pollers) this.pollers = {};
    if (!this.pollers[dataType]) {
      this.pollers[dataType] = new Api(dataType);
    }
    return this.pollers[dataType];
  }

  constructor(dataType) {
    this.dataType = dataType;
    this.subscriptions = [];
  }

  // subscribes to polled data. two cases:
  // - fresh data already present, add subscriber, give data, and move on
  // - stale data, first subscriber, restart pool loop
  subscribe(callback) {
    this.subscriptions.push(callback);

    if (this.freshData()) {
      callback(this.data);
    } else if (this.subscriptions.length === 1) {
      // first subscriber kicks off a pool loop
      this.pollLoop()
    }
  }

  freshData() {
    return this.data && this.lastPolled &&
      ((new Date()) - this.lastPolled) < Api.INTERVALS[this.dataType];
  }

  pollLoop() {
    if (this.subscriptions.length === 0) {
      return;
    }

    this.lastPolled = new Date();
    fetch(Api.URLS[this.dataType])
      .then(res => res.json())
      .then(data => {
        this.data = data;
        this._arrivalsByStation = null; // clear cache if exists
        this.broadcast();
        this.queuePoll();
      }).catch(() => { this.queuePoll(); });
  }

  queuePoll() {
    this.timeoutID = setTimeout(() => {
      this.pollLoop();
    }, Api.INTERVALS[this.dataType]);
  }

  broadcast() {
    this.subscriptions.forEach((sub) => sub(this.data));
  }

  unsubscribe(callback) {
    var ind = this.subscriptions.indexOf(callback);
    if (ind === -1) return;
    this.subscriptions.splice(ind, 1);
  }

  static busesByRoute() {
    let api = this.poller('buses');
    if (!api) return {};
    return api.busesByRoute();
  }

  busesByRoute() {
    if (this._busesByRoute) {
      return this._busesByRoute;
    }
    this._busesByRoute = Api.buildByRoute(this.data || []);
    return this._busesByRoute;
  }

  static buildByRoute(buses) {
    var byRoute = {};
    for (let i = 0; i < buses.length; i++) {
      var bus = buses[i];
      var route = byRoute[bus.ROUTE];
      if (!route) {
        route = byRoute[bus.ROUTE] = {};
      }
      route[bus.VEHICLE] = bus;
      bus.msgDate = new Date(bus.MSGTIME);
    }
    return byRoute;
  }

  static arrivalsByStation() {
    let api = this.poller('trains');
    if (!api) return {};
    return api.arrivalsByStation();
  }

  arrivalsByStation() {
    if (this._arrivalsByStation) {
      return this._arrivalsByStation;
    }
    this._arrivalsByStation = Api.buildByStation(this.data || []);
    return this._arrivalsByStation;
  }

  static buildByStation(arrivals) {
    var byStation = {};
    for (let i = 0; i < arrivals.length; i++) {
      var arr = arrivals[i];
      var station = byStation[arr.STATION];
      if (!station) {
        station = byStation[arr.STATION] = {};
      }
      if (!station[arr.DIRECTION]) {
        station[arr.DIRECTION] = {
          time: arr.WAITING_SECONDS,
          desc: arr.WAITING_TIME,
          id: arr.TRAIN_ID,
          line: arr.LINE
        };
      }
    }
    return byStation;
  }
}

export default Api;
