// const stub = require("./arrivals_stub.json");

class Api {
  static subscriptions = [];
  static arrivals = null;
  static intervalID = null;
  static TRAINS_URL = '//salty-brushlands-11905.herokuapp.com/api/trains';

  static subscribe(callback) {
    if(this.subscriptions.indexOf(callback) === -1) {
      this.subscriptions.push(callback);
      if(this.subscriptions.length === 1) {
        this.fetchTrains();
      }
    }

    // initial fire, if already cached
    if(this.arrivalsByStation) {
      callback(this.arrivalsByStation);
    }
  }

  static unsubscribe(callback) {
    var ind = this.subscriptions.indexOf(callback);
    if (ind === -1) return;
    this.subscriptions.splice(ind, 1);
    if(this.subscriptions.length === 0) {
      clearTimeout(this.timeoutID);
    }
  }

  static byStation(arrivals) {
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
          id: arr.TRAIN_ID,
          line: arr.LINE
        };
      }
    }
    return byStation;
  }

  static fetchTrains() {
    fetch(this.TRAINS_URL)
      .then(res => res.json())
      .then(list => {
        this.arrivals = list;
        this.arrivalsByStation = this.byStation(list);
        this.fireSubs();
      });
    // this.arrivalsByStation = stub;
    // this.fireSubs();
    this.timeoutID = setTimeout(() => {
      this.fetchTrains();
    }, 11000);
  }

  static fireSubs() {
    this.subscriptions.forEach((sub) => sub(this.arrivalsByStation));
  }
}

export default Api;
