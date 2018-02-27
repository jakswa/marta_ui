export default class Location {
  static locationAvailable() {
    return !!window.localStorage.getItem("locationSuccess");
  }

  static cachedLocation() {
    var cached = window.localStorage.getItem("locationSuccess");
    if (cached) {
      return JSON.parse(cached);
    }
  }

  static getLocation() {
    return new Promise((resolve, reject) => {
      var cached = this.cachedLocation();
      if (cached) {
        resolve(cached);
        return;
      }
      window.navigator.geolocation.getCurrentPosition((loc) => {
        cached = JSON.stringify({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
        window.localStorage.setItem("locationSuccess", cached);
        resolve(loc.coords);
      }, (err) => {
        reject(err);
      });
    })
  }
}
