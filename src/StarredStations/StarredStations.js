// TODO: make this into a component, and do NearestStations too
const key = "starred-stations";

class StarredStations {
  static _stars = JSON.parse(window.localStorage.getItem(key) || '{}');

  static stars() {
    var i = [];
    for(var j in this._stars) {
      i.push(j);
    }
    return i;
  }

  static isStarred(stationName) {
   return  !!this._stars[stationName];
  }

  static star(stationName) {
    this._stars[stationName] = true;
    this.saveStars();
  }

  static unstar(stationName) {
    delete this._stars[stationName];
    this.saveStars();
  }

  static toggle(stationName) {
    if (this._stars[stationName]) {
      this.unstar(stationName);
    } else {
      this.star(stationName);
    }
  }

  static saveStars() {
    window.localStorage.setItem(key, JSON.stringify(this._stars));
  }
}

export default StarredStations;
