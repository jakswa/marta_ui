class Api {
  static subs = [];
  static arrivals = null;
  static lastRequest = null;
  static AGE = 10000;
  static TRAINS_URL = 'http://salty-brushlands-11905.herokuapp.com/api/trains';

  static subscribe(callback) {
    this.subs.push(callback);
    if (this.arrivals) {
      callback(this.arrivals);
    }
  }

  static unsubscribe(callback) {
    let index = this.subs.indexOf(callback);
    if(index === -1) return;
    this.subs.splice(index,1);
  }

  static start() {
    this.started = true;
    this.fetchTrains();
    setInterval(() => {
      this.fetchTrains();
    }, this.AGE);
  }

  static request(url) {
    return fetch(url);
  }

  static fetchTrains() {
    this.request(this.TRAINS_URL)
      .then(res => res.json())
      .then(list => {
        this.subs.forEach((s) => s(list));
      }).catch(err => {
        console.log("ERRORRR:", err.message);
      });
  }
}

// TODO: figure this out...
if (process.env.NODE_ENV !== 'test') {
  Api.start();
}

export default Api;
