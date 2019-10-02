import { AppTheme } from './types/types'
import { red,grey } from "@material-ui/core/colors";

const AppThemeOptions = {
  [AppTheme.LIGHT]: {
    palette: {
      type: 'light',
      primary: {
        light: red[200],
        main: '#607D8B',
        dark: red[600]
      },
      secondary: {
        light: red[200],
        main: red[400],
        dark: red[600]
      },
    },
  },
  [AppTheme.DARK]: {
    palette: {
        type: 'dark',
        primary: {
          light: grey[900],
          main: grey[900],
          dark: grey[900],
        },
        secondary: {
          light: grey[300],
          main: grey[300],
          dark: grey[300],
        },
      },
    
  }
};

export default AppThemeOptions;
