import React, { useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Container  from "@material-ui/core/Container";
import Tutorials from "./Tutorials";
import Publications from "./Publications";
import Organelles from "./Organelles";
import DatasetLayout from "./DatasetLayout";
import DatasetDetails from "./DatasetDetails";
import "./Index.css";
import { AppContext } from "../context/AppContext";
import { makeDatasets } from "../api/datasets";
import Home from "./Home";
import { NewsPostCollection } from "./NewsPost";
import { getPosts } from "../api/posts";

export default function Index() {
  const {appState, setAppState} = useContext(AppContext);

  // Update the global datasets var when Home renders for the first time
  useEffect(() => {
    setAppState({ ...appState, datasetsLoading: true });
    makeDatasets(appState.metadataEndpoint).then(ds =>
      setAppState({ ...appState, datasets: ds, datasetsLoading: false })
    );
    getPosts(appState.postsAPI).then(posts => {setAppState({...appState, posts: posts!})})
  }, []); 

  return (
    <div className="content">
      <Container maxWidth="lg">
        <Switch>
          <Route path="/faq" component={Tutorials} />
          <Route path="/publications" component={Publications} />
          <Route path="/organelles" component={Organelles} />
          <Route path="/news" exact component={NewsPostCollection} />
          <Route path="/home" exact component={Home} />
          <Route path="/datasets/:slug" component={DatasetDetails} />
          <Route path="/datasets/" component={DatasetLayout} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Container>
    </div>
  );
}
