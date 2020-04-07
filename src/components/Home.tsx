import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Pagination from '@material-ui/lab/Pagination';
import Markdown from "react-markdown/with-html"
import thumbnail from "./cosem3d.png";
import { makeDatasets } from "../api/datasets";
import { Grid, Divider } from "@material-ui/core";
import { AppContext } from "../context/AppContext";
import LaunchIcon from '@material-ui/icons/Launch'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: theme.spacing(2)
  },
  grid: {
    direction: "row",
    alignItems: "center",
    justify: "center"
  },
  markdown: {
    textAlign: "left",
  },
  masthead: {
    background: [
      "linear-gradient(90deg, rgba(51,51,51,1) 0%, rgba(119,119,119,1) 95%, rgba(51,51,51,1) 100%)",
      "rgb(51,51,51)"
    ],
    height: "100px"
  },
  thumbnail: {
    float: "right"
  },
  title: {
    float: "left",
    marginTop: "20px",
    marginLeft: "1em",
    color: "#fff"
  }
}));

async function getText(url: string, fallback: string) {
  return fetch(url, { cache: "reload" }).then(response => response.ok ? response.text() : fallback, () => fallback);
};

export default function Home() {
  const classes = useStyles();
  const [datasets, setDatasets] = useState([]);
  const [mdText, setMdText] = useState([]);
  const [appState, setAppState] = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 10;

  useEffect(() => {
    const datasets = makeDatasets(appState.dataBucket);
    datasets.then(setDatasets);
    datasets.then(console.log)
    // Temporary for testing markdown rendering
    //const readmes = datasets.then(ds => fetch(ds., {cache: "reload"}).then((response) => response.text());
    const mdText = datasets.then(ds => Promise.all(ds.map(async d => await getText(d.readmeURL, "No description provided"))));
    mdText.then(setMdText);
    mdText.then(console.log)
  }, []);

  // this loop will be where you modify the meta information and generate
  // the urls.

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const displayedDataSets = datasets.slice(rangeStart, rangeEnd).map((dataset, i) => {
    const key = `${dataset.path}_${rangeStart}_${i}`;
    return (

      <Paper key={key} className={classes.paper}>
        <Grid container className={classes.grid} spacing={2}>
          <Grid item xs={12} sm={8} zeroMinWidth>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Markdown source={mdText[i]} escapeHtml={false} className={classes.markdown} />
              </Grid>
              <Grid item>
                <Typography variant="caption">Source: {dataset.path}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <a href={`${appState.neuroglancerAddress}${dataset.neuroglancerURLFragment}`} target="_blank" rel="noopener noreferrer">View with neuroglancer</a><LaunchIcon />
          </Grid>
        </Grid>
      </Paper>
    );
  });

  return (
    <>
      <div className={classes.masthead}>
        <Typography className={classes.title} variant="h3">
          FIB-SEM datasets
        </Typography>
        <img
          className={classes.thumbnail}
          src={thumbnail}
          alt="3D cosem image render"
        />
      </div>
      <div className="content">
        <Container maxWidth="md">
          <p>{rangeStart + 1} to {Math.min(rangeEnd, datasets.length)} of {datasets.length}</p>
          {datasets.length > datasetsPerPage && <Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />}
          {displayedDataSets}
          {datasets.length > datasetsPerPage && <Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />}
        </Container>
      </div>
    </>
  );
}
