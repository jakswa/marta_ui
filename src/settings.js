const STORAGE_KEY = 'mui-settings';

class Settings {
  static _settings = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');

  static get(name) {
    return this._settings[name];
  }

  static set(name, val) {
    this._settings[name] = val;
    this.save();
  }

  static toggle(name) {
    this._settings[name] = !this._settings[name];
    this.save();
  }

  static del(name) {
    delete this._settings[name];
    this.save();
  }

  static save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this._settings));
  }
}

export default Settings;
