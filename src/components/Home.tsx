import React, { useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Code from "./Code";
import Tutorials from "./Tutorials";
import Publications from "./Publications";
import Organelles from "./Organelles";
import DatasetList from "./DatasetList";
import DatasetDetails from "./DatasetDetails";
import "./Home.css";
import { AppContext } from "../context/AppContext";
import { makeDatasets } from "../api/datasets";

export default function Home() {
  const {appState, setAppState} = useContext(AppContext);

  // Update the global datasets var when Home renders for the first time
  useEffect(() => {
    setAppState({ ...appState, datasetsLoading: true });
    makeDatasets(appState.dataBucket).then(ds =>
      setAppState({ ...appState, datasets: ds, datasetsLoading: false })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="content">
      <Container maxWidth="lg">
        <Switch>
          <Route path="/code" component={Code} />
          <Route path="/tutorials" component={Tutorials} />
          <Route path="/publications" component={Publications} />
          <Route path="/organelles" component={Organelles} />
          <Route path="/" exact component={DatasetList} />
          <Route path="/datasets/:slug" component={DatasetDetails} />
        </Switch>
      </Container>
    </div>
  );
}
