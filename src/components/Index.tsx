import React from "react";
import { Route, Switch } from "react-router-dom";
import Container  from "@material-ui/core/Container";
import Tutorials from "./Tutorials";
import Publications from "./Publications";
import Organelles from "./Organelles";
import DatasetLayout from "./DatasetLayout";
import DatasetDetails from "./DatasetDetails";
import "./Index.css";
import Home from "./Home";
import NewsPostCollection from "./NewsPostCollection";
import NewsPost from "./NewsPost";

export default function Index() {
  return (
    <div className="content">
      <Container maxWidth="lg">
        <Switch>
          <Route path="/faq" component={Tutorials} />
          <Route path="/publications" component={Publications} />
          <Route path="/organelles" component={Organelles} />
          <Route path="/news/:slug" component={NewsPost} />
          <Route path="/news/" component={NewsPostCollection} />
          <Route path="/home" exact component={Home} />
          <Route path="/datasets/:slug" component={DatasetDetails} />
          <Route path="/datasets/" component={DatasetLayout} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Container>
    </div>
  );
}
