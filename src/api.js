class Api {
  static subs = [];
  static arrivals = null;
  static lastRequest = null;
  static AGE = 10000;
  static TRAINS_URL = '//salty-brushlands-11905.herokuapp.com/api/trains';

  static subscribe(callback) {
    this.subs.push(callback);
    if (this.arrivals) {
      callback(this.arrivals);
    }
  }

  static unsubsribe(callback) {
    let index = this.subs.indexOf(callback);
    if(index === -1) return;
    this.subs.splice(index,1);
  }

  static start() {
    this.fetchTrains();
    setInterval(() => {
      this.fetchTrains();
    }, this.AGE);
  }

  static fetchTrains() {
    fetch(this.TRAINS_URL)
      .then(res => res.json())
      .then(list => {
        this.subs.forEach((s) => s(list));
      });
  }
}

Api.start();

export default Api;
