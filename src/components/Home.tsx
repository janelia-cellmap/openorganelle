import React, { useEffect, useState, useContext } from "react";
import Markdown from "react-markdown/with-html";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import { Grid, Divider } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import LaunchIcon from "@material-ui/icons/Launch"
import { makeDatasets, Dataset, Volume } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

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

export default function Home() {
  const classes = useStyles();
  const datasetsInit: Dataset[] = [];
  const checkStateInit: Map<string, boolean> = new Map;
  const [datasets, setDatasets] = useState(datasetsInit);
  const [appState, setAppState] = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  
  const datasetsPerPage = 10;

  function makeCheckbox(name: string, checkState: Map<string, boolean>, setCheckState: any, key: string) {   
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckState(checkState.set(event.target.name, event.target.checked) );
    };
  
    return (
      <FormGroup row key={key}>
        <FormControlLabel
          control={<Checkbox checked={checkState.get(name)} onChange={handleChange} name={name} />}
          label={name}
        />
      </FormGroup>
    );
  }

  function makeNeuroglancerURL(address: string, dataset: Dataset, volumeNames: string[]){
  const displayVolumes: Volume[] = volumeNames.map(k => dataset.volumes.get(k));
  const key = `${dataset.path}_${volumeNames.join('_')}` 
  return (
  <Grid item xs={12} sm={4} key={key}>
    <a href={`${address}${dataset.makeNeuroglancerViewerState(displayVolumes)}`}
  target="_blank" rel="noopener noreferrer">View with neuroglancer</a>
  <LaunchIcon />
  </Grid>)}
 
  function RenderDataset({dataset,appState}){
    const [checkState, setCheckState] = useState(checkStateInit);    
    const volumeNames: string[] = [...dataset.volumes.keys()];
      
      return (
        <Paper className={classes.paper}>
          <Grid container className={classes.grid} spacing={2}>
            <Grid item xs={12} sm={8} zeroMinWidth>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Markdown source={dataset.readme.content} escapeHtml={false} className={classes.markdown} />
                </Grid>
                <Grid item>
                  <Typography variant="caption">Source URL: {dataset.path}</Typography>
                </Grid>
              </Grid>
            </Grid>
            {makeNeuroglancerURL(appState.neuroglancerAddress, dataset, volumeNames)}          
            {volumeNames.map(k => makeCheckbox(k, checkState, setCheckState, `${dataset.name}/${k}`))}
          </Grid>
        </Paper>
      );
    }

  useEffect(() => {
    const datasets = makeDatasets(appState.dataBucket);
    datasets.then(setDatasets);
    datasets.then(console.log);
  }, []);

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

const displayedDataSets = datasets.slice(rangeStart, rangeEnd).map((ds, i) => <RenderDataset dataset={ds} appState={appState} key = {`${ds.path}_${rangeStart}_${i}`}/>);
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
