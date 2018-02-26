import Marta from './index';
import Stations from './stations';

describe("stationsNearest", () => {
  test('does not blow up', () => {
    Marta.stationsNearest(0,0);
  });

  test('gives correct nearest station', () => {
    var name = Stations.NAMES[0];
    var loc = Stations.LOCATIONS[name];

    var sorted = Marta.stationsNearest(loc.latitude, loc.longitude);
    expect(sorted[0]).toEqual(name);
  });

  test('says that airport is farthest from north springs', () => {
    var name = 'north springs station';
    var loc = Stations.LOCATIONS[name];

    var sorted = Marta.stationsNearest(loc.latitude, loc.longitude);
    expect(sorted[sorted.length - 1]).toEqual('airport station');
  });
});
