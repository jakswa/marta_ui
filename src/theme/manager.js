import AppThemeOptions from './theme';
import { createMuiTheme } from "@material-ui/core/styles";

class ThemeManager {
  static darkSubscribe() {
    if (this.prefersDark !== undefined) return;

    let query = window.matchMedia('(prefers-color-scheme: dark)');
    this.prefersDark = query.matches;
    query.onchange = () => {
      this.prefersDark = query.matches;
    };
  }

  static current() {
    return this.prefersDark ? 'dark' : 'light';
  }

  static cachedTheme() {
    this.darkSubscribe();
    let currentTheme = this.current();

    if (this.themeSetting !== currentTheme) {
      this.themeSetting = currentTheme;
      const themeOpts = AppThemeOptions[currentTheme];
      this.builtTheme = createMuiTheme(themeOpts);
    }
    return this.builtTheme;
  }
}

export default ThemeManager
