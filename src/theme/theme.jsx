import { grey } from "@material-ui/core/colors";

const AppThemeOptions = {
  light: {
    palette: {
      type: 'light',
      primary: {
        main: '#607D8B',
      },
    },
  },
  dark: {
    palette: {
      type: 'dark',
      primary: {
        main: grey[800],
      },
    },
  }
};

export default AppThemeOptions;
