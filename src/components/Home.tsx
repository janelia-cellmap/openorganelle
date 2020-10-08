import React, { useEffect, useContext } from "react";
import { Route, NavLink, Switch } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import Software from "./Software";
import Tutorials from "./Tutorials";
import Publications from "./Publications";
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
    },
    mastheadText: {
      marginTop: "3em",
      fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
      padding: "1em",
      position: "absolute",
      bottom: "0",
      left: "1em",
      textShadow: "0 1px 0 black"
    },
    masthead: {
      background: ["linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))",`url(${banner})`],
      backgroundPositionX: 'right',
      backgroundSize: "cover",
      minHeight: "200px",
      marginBottom: 0,
      position: "relative",
      color: "#fff"
    },
    secondaryNav: {
      background: "#27507C",
      color: "#fff",
      minHeight: "40px"
    },
    navList: {
      display: "block",
      marginTop: 0
    },
    navListItem: {
      color: "#ccc",
      borderBottom: "8px solid transparent",
      display: "inline-block",
      padding: "12px 0 2px 0",
      marginRight: "0.8em",
      textAlign: "center",
      minWidth: "5em"
    },
  })
);

export default function Home() {

  const classes = useStyles();
  const [appState, setAppState] = useContext(AppContext);

  // Update the global datasets var when Home renders for the first time
  useEffect(() => {
    setAppState({ ...appState, datasetsLoading: true })
    makeDatasets(appState.dataBucket)
      .then((ds) => setAppState({ ...appState, datasets: ds, datasetsLoading: false }));
  }, []);

  return (
    <>
      <div className={classes.masthead}>
        <Grid container spacing={2} className={classes.root}>
          <Grid item sm={10} md={6} className={classes.mastheadText}>
            <Typography variant="h3">Open Organelle</Typography>
            <Typography variant="body1" gutterBottom>
             Explore cells and tissue at nanometer resolution
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.secondaryNav}>
        <ul className={classes.navList}>
          <NavLink exact to="/">
            <li className={classes.navListItem}>Datasets</li>
          </NavLink>
          <NavLink to="/software">
            <li className={classes.navListItem}>Software</li>
          </NavLink>
          <NavLink to="/publications">
            <li className={classes.navListItem}>Publications</li>
          </NavLink>
          <NavLink to="/tutorials">
            <li className={classes.navListItem}>Tutorials</li>
          </NavLink>
        </ul>
      </div>
      <div className="content">
        <Container maxWidth="lg">
          <Switch>
            <Route path="/software" component={Software} />
            <Route path="/tutorials" component={Tutorials} />
            <Route path="/publications" component={Publications} />
            <Route path="/" exact component={DatasetList} />
            <Route path="/datasets/:slug" component={DatasetDetails} />
          </Switch>
        </Container>
      </div>
    </>
  );
}
