import { grey } from "@material-ui/core/colors";

const AppThemeOptions = {
  light: {
    spacing: 4,
    palette: {
      type: 'light',
      primary: {
        main: '#607D8B',
      },
      background: {
        main: '#fff',
      }
    },
  },
  dark: {
    spacing: 4,
    palette: {
      type: 'dark',
      primary: {
        main: grey[800],
      },
      background: {
        main: '#303030',
      }
    },
  }
};

export default AppThemeOptions;
