import React, { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('darkMode');
    return storedTheme? JSON.parse(storedTheme) : true;
  });

  const toggleDarkMode = () => setDarkMode(prevMode => {
    const newMode = !prevMode;
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    return newMode;
  });

  // Dynamically create the theme based on `darkMode`
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
