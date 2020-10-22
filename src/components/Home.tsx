import React, { useEffect, useContext } from "react";
import { Route, NavLink, Link, Switch } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import Software from "./Software";
import Tutorials from "./Tutorials";
import Publications from "./Publications";
import Organelles from "./Organelles";
import DatasetList from "./DatasetList";
import DatasetDetails from "./DatasetDetails";
import thumbnail from "./cosem_segmentation_gradient.png";
import banner from "./cosem_banner.jpg";
import "./Home.css";
import { AppContext } from "../context/AppContext";
import { makeDatasets } from "../api/datasets";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    thumbnail: {
      maxWidth: "100%",
      padding: "2em 0 0 2em"
    }
  })
);

export default function Home() {
  const classes = useStyles();
  const [appState, setAppState] = useContext(AppContext);

  // Update the global datasets var when Home renders for the first time
  useEffect(() => {
    setAppState({ ...appState, datasetsLoading: true });
    makeDatasets(appState.dataBucket).then(ds =>
      setAppState({ ...appState, datasets: ds, datasetsLoading: false })
    );
  }, []);

  return (
    <div className="content">
      <Container maxWidth="lg">
        <Switch>
          <Route path="/software" component={Software} />
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
