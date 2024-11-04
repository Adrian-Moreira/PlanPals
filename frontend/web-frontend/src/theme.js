import { createTheme } from '@mui/material/styles'

export const lightThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#545caf',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#e0e5f1',
      paper: '#e4ecff',
    },
    text: {
      primary: '#000000',
      secondary: '#545caf',
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#e4ecff',
          borderRadius: '0.75em',
        },
        indicator: {
          backgroundColor: '#545caf',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          // textTransform: 'none',
          color: '#545caf',
          '&.Mui-selected': {
            color: '#000000',
          },
          '&:hover': {
            color: '#4089df',
            opacity: 1,
          },
        },
      },
    },
  },
}

export const darkThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#eaebf9',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#0c1231',
      paper: '#1e305a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaabb9',
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e305a',
          borderRadius: '0.75em',
        },
        indicator: {
          backgroundColor: '#eaebf9',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          // textTransform: 'none',
          color: '#8a9b99',
          '&.Mui-selected': {
            color: '#ffffff',
          },
          '&:hover': {
            color: '#4089df',
            opacity: 1,
          },
        },
      },
    },
  },
}

export const lightTheme = createTheme(lightThemeOptions)
export const darkTheme = createTheme(darkThemeOptions)
