// const stub = require("./arrivals_stub.json");

class Api {
  static subscriptions = [];
  static arrivals = null;
  static intervalID = null;
  static lastFetched = new Date();
  static TRAINS_URL = '//queasy-idiotic-calf.gigalixirapp.com/api/trains';

  static subscribe(callback, noInitialFire) {
    if(this.subscriptions.indexOf(callback) === -1) {
      this.subscriptions.push(callback);
      if(this.subscriptions.length === 1 && !this.arrivals) {
        clearTimeout(this.timeoutID); // just in case?
        this.fetchTrains();
      }
    }

    // initial fire, if already cached
    if(this.arrivals && !noInitialFire) {
      callback(this.arrivals);
    }
  }

  static unsubscribe(callback) {
    var ind = this.subscriptions.indexOf(callback);
    if (ind === -1) return;
    this.subscriptions.splice(ind, 1);
  }

  static fetchTrains() {
    fetch(this.TRAINS_URL)
      .then(res => res.json())
      .then(list => {
        this.arrivals = list;
        // clear cached values
        this._arrivalsByStation = null;
        this.fireSubs();
      });
    // this.arrivals = stub;
    // this.fireSubs();

    this.timeoutID = setTimeout(() => {
      this.fetchTrains();
    }, 11000);
  }

  static arrivalsByStation() {
    if (this._arrivalsByStation) {
      return this._arrivalsByStation;
    }
    this._arrivalsByStation = this.buildByStation(this.arrivals || []);
    return this._arrivalsByStation;
  }

  static buildByStation(arrivals) {
    var byStation = {};
    for(let i = 0; i < arrivals.length; i++) {
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


  static fireSubs() {
    this.subscriptions.forEach((sub) => sub(this.arrivals));
  }
}

export default Api;
