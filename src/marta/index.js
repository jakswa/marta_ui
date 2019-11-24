import Stations from "./stations";

const serviceExceptions = [
  {service_id: 4, date: 20190902, exception_type: 1},
  {service_id: 5, date: 20190902, exception_type: 2},
  {service_id: 4, date: 20191128, exception_type: 1},
  {service_id: 5, date: 20191128, exception_type: 2},
  {service_id: 4, date: 20191129, exception_type: 1},
  {service_id: 5, date: 20191129, exception_type: 2}
]

class Marta {
  static stationsNearest(lat, long) {
    var list = Stations.NAMES.slice(0); // duplicate to mutate
    list.sort(function(name1, name2) {
      var loc1 = Stations.LOCATIONS[name1];
      var loc2 = Stations.LOCATIONS[name2];

      // pretty much pythagorean theorem, don't need sqrt
      var dist1 = Math.pow(loc1.latitude - lat, 2) +
        Math.pow(loc1.longitude - long, 2);
      var dist2 = Math.pow(loc2.latitude - lat, 2) +
        Math.pow(loc2.longitude - long, 2);

      if (dist1 < dist2) return -1;
      if (dist1 > dist2) return 1;
      return 0;
    });

    return list;
  }

  static serviceId() {
    let serviceId = this.defaultServiceId();

    // check exceptions
    const today = this.formatDate(new Date());
    const exceptions = serviceExceptions.filter(exception => exception.date.toString() === today);
    if (exceptions.length) {


    }
    return serviceId;
  }

  // private
  static defaultServiceId() {
    const today = new Date();
    const day = today.getDay();
    switch(day) {
      case 6: // Saturday
        return 3;
      case 0: // Sunday
        return 4;
      default: // weekdays
        return 5;
    }
  }

  static formatDate(date) {
    // yyyymmdd
    return (date).toISOString().slice(0,10).replace(/-/g,"");
  }
}

export default Marta;
