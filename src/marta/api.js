const stub = require("./arrivals_stub.json");

class Api {
  static subscriptions = [];
  static arrivals = null;
  static intervalID = null;
  static lastFetched = new Date();
  static TRAINS_URL = '//salty-brushlands-11905.herokuapp.com/api/trains';

  static subscribe(callback) {
    if(this.subscriptions.indexOf(callback) === -1) {
      this.subscriptions.push(callback);
      if(this.subscriptions.length === 1 && !this.arrivals) {
        clearTimeout(this.timeoutID); // just in case?
        this.fetchTrains();
      }
    }

    // initial fire, if already cached
    if(this.arrivals) {
      callback(this.arrivals);
    }
  }

  static unsubscribe(callback) {
    var ind = this.subscriptions.indexOf(callback);
    if (ind === -1) return;
    this.subscriptions.splice(ind, 1);
  }

  static fetchTrains() {
    // fetch(this.TRAINS_URL)
    //   .then(res => res.json())
    //   .then(list => {
    //     this.arrivals = list;
    //     this.fireSubs();
    //   });
    this.arrivals = stub;
    this.fireSubs();

    this.timeoutID = setTimeout(() => {
      this.fetchTrains();
    }, 11000);
  }

  static fireSubs() {
    this.subscriptions.forEach((sub) => sub(this.arrivals));
  }
}

export default Api;
