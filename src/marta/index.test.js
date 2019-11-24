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

describe('serviceId', () => {
  test('when today is not an exception', () => {
    // jest
    // .spyOn(global, 'Date')
    // .mockImplementationOnce(() => new Date('2019-11-24T11:01:58.135Z'));

    expect(Marta.serviceId()).toEqual(4);
  });

  test('when today is an exception and service is removed', () => {

  });

  test('when today is an exception and service is added', () => {

  });

  test('when today is an exception and service is added and removed', () => {

  });
})
