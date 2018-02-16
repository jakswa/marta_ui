import Stations from "./stations";

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
}

export default Marta;
