import React from "react";
import Home from "./components/Home";
import About from "./components/About";
import Analysis from "./components/Analysis";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
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
              <Route path="/analysis">
                <Analysis />
              </Route>
              <Route path="">
                <Home />
              </Route>
            </Switch>
            <Footer/>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
