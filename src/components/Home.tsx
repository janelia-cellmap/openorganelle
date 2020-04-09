import React, { useEffect, useState, useContext } from "react";
import Markdown from "react-markdown/with-html";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import { Grid, Divider } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";

import { makeDatasets } from "../api/datasets";
import { AppContext } from "../context/AppContext";

import thumbnail from "./COSEM_background.png";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  thumbnail: {
    maxWidth: "100%",
    padding: "2em 0 0 2em"
  },
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
    escapeHtml: false,
    textAlign: "left"
  },
  mastheadText: {
    marginTop: "3em",
    fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
    padding: "1em"
  },
  masthead: {
    background: "#5084AC",
    minHeight: "411px",
    marginBottom: 0,
    color: "#fff"
  },
  secondaryNav: {
    background: "#27507C",
    color: "#fff",
    minHeight: "40px"
  },
  navList: {
    display:'block',
    marginTop: 0
  },
  navListItem: {
    display: 'inline-block',
    padding: "12px 0 2px 0",
    borderBottom: "8px solid #fff",
    textAlign:"center",
    minWidth: "5em"
  }
}));

async function getText(d: string) {
  return fetch(d, { cache: "reload" }).then(response => response.text());
}

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
    datasets.then(console.log);
    // Temporary for testing markdown rendering
    //const readmes = datasets.then(ds => fetch(ds., {cache: "reload"}).then((response) => response.text());
    const mdText = datasets.then(ds =>
      Promise.all(ds.map(async d => await getText(d.readmeURL)))
    );
    mdText.then(setMdText);
    mdText.then(console.log);
  }, []);

  // this loop will be where you modify the meta information and generate
  // the urls.

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const displayedDataSets = datasets
    .slice(rangeStart, rangeEnd)
    .map((dataset, i) => {
      const key = `${dataset.path}_${rangeStart}_${i}`;
      return (
        <Paper key={key} className={classes.paper}>
          <Grid container className={classes.grid} spacing={10}>
            <Grid item xs zeroMinWidth>
              <Markdown
                source={mdText[i]}
                escapeHtml={false}
                className={classes.markdown}
              />
            </Grid>
            <Divider orientation="vertical" />
            <Grid item>
              {" "}
              <a
                href={`${appState.neuroglancerAddress}${dataset.neuroglancerURLFragment}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View with neuroglancer
              </a>{" "}
            </Grid>
          </Grid>
        </Paper>
      );
    });

  return (
    <>
      <div className={classes.masthead}>
        <Grid container spacing={2} className={classes.root}>
          <Hidden smDown>
            <Grid item sm={4}>
              <img
                className={classes.thumbnail}
                src={thumbnail}
                alt="3D cosem image render"
              />
            </Grid>
            <Grid item sm={1} />
          </Hidden>
          <Grid item sm={10} md={6} className={classes.mastheadText}>
            <Typography variant="h3">FIB-SEM datasets</Typography>
            <Typography variant="body1" gutterBottom>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eu
              purus ante. Sed a euismod turpis. Nulla tempus lorem odio, vitae
              laoreet mauris malesuada vitae. Fusce urna est, vestibulum in
              sodales nec, ullamcorper ut quam. Morbi dapibus a elit sit amet
              consectetur. Aenean in justo id massa ullamcorper bibendum eget
              eget arcu. Suspendisse vitae massa elit.
            </Typography>

            <Typography variant="body1">
              Donec lacus tellus, ullamcorper lobortis maximus in, sagittis et
              augue. Vivamus accumsan, odio gravida sodales dignissim, nisi est
              ornare libero, ac vulputate nibh mi a eros. Integer ut ante massa.
              Aliquam erat volutpat. Aliquam erat volutpat. Proin a nulla nisi.
              Pellentesque semper urna purus, lobortis dapibus massa suscipit
              in. Suspendisse porttitor quis neque id porta.
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.secondaryNav}>
        <ul className={classes.navList}>
          <li className={classes.navListItem}>Datasets</li>
        </ul>
      </div>
      <div className="content">
        <Container maxWidth="md">
          <Typography variant="h5">Datasets{" "}
            {rangeStart + 1} to {Math.min(rangeEnd, datasets.length)} of{" "}
            {datasets.length}
          </Typography>
          {datasets.length > datasetsPerPage && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
            />
          )}
          {displayedDataSets}
          {datasets.length > datasetsPerPage && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
            />
          )}
        </Container>
      </div>
    </>
  );
}
