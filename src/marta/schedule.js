class Schedule {
  static STOP_URL = 'https://rust.marta.io/stop_times?name=:stop_name';
  static _stopCache = {};

  static forStop(stopName) {
    var stopSchedule = this._stopCache[stopName];
    const storeKey = `sched-${stopName}`;

    if (!stopSchedule) {
      let str = window.localStorage.getItem(storeKey);
      if (str) {
        stopSchedule = JSON.parse(str);
        this._stopCache[stopName] = stopSchedule;
      }
    }

    if (stopSchedule) return Promise.resolve(stopSchedule);

    return fetch(this.STOP_URL.replace(':stop_name', stopName))
      .then((res) => res.json())
      .then((stopSchedule) => {
        stopSchedule.forEach((sched) => {
          sched.trip_ids = sched.trip_ids.split(',');
          sched.arrival_times = sched.arrival_times.split(',');
        });
        this._stopCache[stopName] = stopSchedule;
        localStorage.setItem(storeKey, JSON.stringify(stopSchedule));
        return stopSchedule;
      });
  }
}

export default Schedule;
