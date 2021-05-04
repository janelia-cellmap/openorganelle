import React, { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import { AppProvider } from "./context/AppContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import "./App.css";

const Analysis = lazy(() => import("./components/Analysis"));
const TermsOfUse = lazy(() => import("./components/TermsOfUse"));
const About = lazy(() => import("./components/About"));
const Home = lazy(() => import("./components/Home"));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5084AC"
    },
    secondary: {
      main: "#27507C"
    }
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
            <Suspense fallback={<div>Loading...</div>}>
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
                <Route path="/terms_of_use">
                  <TermsOfUse />
                </Route>
                <Route path="">
                  <Home />
                </Route>
              </Switch>
            </Suspense>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
