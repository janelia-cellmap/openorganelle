import React, { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import { AppProvider } from "./context/AppContext";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { QueryClientProvider, QueryClient } from "react-query";
import "./App.css";
import { PostsProvider } from "./context/PostsContext";

const Analysis = lazy(() => import("./components/Analysis"));
const TermsOfUse = lazy(() => import("./components/TermsOfUse"));
const About = lazy(() => import("./components/About"));
const Index = lazy(() => import("./components/Index"));

const queryClient = new QueryClient()

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
      <QueryClientProvider client={queryClient}>
      <AppProvider>
        <PostsProvider>
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
                <Route path="/measurements">
                  <Analysis />
                </Route>
                <Route path="/terms_of_use">
                  <TermsOfUse />
                </Route>
                <Route path="/tutorials">
                  <Redirect to="/faq" />
                </Route>
                <Route path="/code">
                  <Redirect to="/faq" />
                </Route>
                <Route path="">
                  <Index />
                </Route>
              </Switch>
            </Suspense>
            <Footer />
          </div>
        </Router>
        </PostsProvider>
      </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
