import { grey } from "@material-ui/core/colors";

const AppThemeOptions = {
  light: {
    spacing: 4,
    palette: {
      type: 'light',
      primary: {
        main: '#607D8B',
      },
    },
  },
  dark: {
    spacing: 4,
    palette: {
      type: 'dark',
      primary: {
        main: grey[800],
      },
    },
  }
};

export default AppThemeOptions;
