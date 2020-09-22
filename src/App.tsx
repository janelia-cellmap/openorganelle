import React from "react";
import Home from "./components/Home";
import About from "./components/About";
import Navigation from "./components/Navigation";
import Settings from "./components/Settings";
import { AppProvider } from "./context/AppContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5084AC',
    },
    secondary: {
      main: '#27507C',
    },
  },
  status: {
    danger: "orange"
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Router>
          <div className="App">
            <header className="header">
              <Navigation />
            </header>
            <Switch>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
