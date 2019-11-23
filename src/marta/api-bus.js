// const stub = require("./arrivals_stub.json");

class ApiBus {
  static BusUrl = 'https://rust.marta.io/stops';

  static searchBusStops(name) {
    fetch(this.BusUrl, {
      mode: 'no-cors',
    })
    .then(this.validateResponse)
    .then(this.parseJson)
    .then(this.logData)
    .catch(this.logError);
  }

  static validateResponse(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  static parseJson(response) {
    return response.json();
  }

  static logData(data) {
    console.log(data);
  }

  static logError(error) {
    console.log('Error: \n', error);
  }
}

export default ApiBus;
