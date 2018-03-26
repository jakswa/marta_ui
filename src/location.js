export default class Location {
  static cachedLocation() {
    var cached = window.sessionStorage.getItem("locationSuccess");
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
        cached = JSON.stringify({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });
        window.sessionStorage.setItem("locationSuccess", cached);
        resolve(loc.coords);
      }, (err) => {
        reject(err);
      });
    })
  }
}
