import React, { useEffect, useState, useContext, FunctionComponent} from "react";
import Markdown from "react-markdown/with-html";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import { Grid, Divider } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import LaunchIcon from "@material-ui/icons/Launch"
import ErrorIcon from "@material-ui/icons/Error"
import { makeDatasets, Dataset, Volume } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Alert, AlertTitle } from '@material-ui/lab';

import thumbnail from "./COSEM_background.png";
import { checkServerIdentity } from "tls";

const useStyles: any = makeStyles((theme: Theme) => (
  createStyles({root: {
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
    alignItems: "center",
    justify: "center"
  },
  markdown: {    
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
    color: "#fff",
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
})));

type NeuroglancerLinkProps = {  
  address: string, 
  dataset: Dataset, 
  volumeNames: string[]
  webgl2State: boolean
}

type DatasetPaperProps = {
  dataset: Dataset
  appState: any
}

const LayerCheckbox: FunctionComponent<CheckboxProps> = ({name, checked, handleChange}) => {   
  return (
    <FormGroup row>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleChange} name={name} />}
        label={name}
      />
    </FormGroup>
  );
}

const checkWebGL2 = () => {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) {return false} 
  else {return true}
}

type Webgl2WarningProps = {
  webgl2State: boolean
}

const WebGl2WarningAlert: FunctionComponent<Webgl2WarningProps> = (props) => {
  return <Alert severity="warning">
    <AlertTitle>Warning</AlertTitle>
    This is a warning alert — <strong>check it out!</strong>
  </Alert>
}

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {    
    // Display fallback UI    
    this.setState({ hasError: true });    
    // You can also log the error to an error reporting service    
    console.log(error, info);  }
  
    render() {
    if (this.state.hasError) {      
      // You can render any custom fallback UI      
      return <h1>Something went wrong.</h1>;    
    }    
      return this.props.children;
  } 
}

const NeuroglancerLink: FunctionComponent<NeuroglancerLinkProps> = ({address, dataset, volumeNames, webgl2State}) => {  
  const displayVolumes: Volume[] = volumeNames.map(k => dataset.volumes.get(k));
  const key = `${dataset.path}_${volumeNames.join('_')}`   
  const webgl2MissingMessage = <Grid container direction='row' alignItems='center' item>
                              <Grid item>
                                <ErrorIcon/>
                              </Grid>
                              <Grid item>
                              <Typography color='error'>Your browser is not compatible with Neuroglancer. Try a compatible browser, such as Firefox or Chrome.</Typography>
                              </Grid>
                              </Grid>;

  return (
  <Grid item xs={12} sm={4} key={key}>    
    <a href={`${address}${dataset.makeNeuroglancerViewerState(displayVolumes)}`}
  target="_blank" rel="noopener noreferrer">View with Neuroglancer</a>
  <LaunchIcon />
  {!webgl2State && <ErrorIcon/>}  
  </Grid>)}


const DatasetPaper: FunctionComponent<DatasetPaperProps> = ({dataset, appState}) => {
  const volumeNames: string[] = Array.from(dataset.volumes.keys());    
  const checkStateInit = new Map<string, boolean>();
  volumeNames.forEach(v => checkStateInit.set(v, true));
  const [checkState, setCheckState] = useState(checkStateInit);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckState = new Map(checkState.set(event.target.name, event.target.checked).entries());
    const vals = Array.from(newCheckState.values());
    // Prevent all checkboxes from being deselected
    if (!vals.every((v) => !v)){
      setCheckState(newCheckState);
    }
  };
  
  const classes = useStyles();
    return (     
      <Paper className={classes.paper}>
        <Grid container className={classes.grid} spacing={2}>
          <Grid item xs={12} sm={8} zeroMinWidth>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Markdown className={classes.markdown} source={dataset.readme.content} escapeHtml={false}/>
              </Grid>
            </Grid>
          </Grid>
          <NeuroglancerLink address={appState.neuroglancerAddress} dataset={dataset} volumeNames={volumeNames.filter(v => checkState.get(v))} webgl2State={checkWebGL2()}/>          
          {volumeNames.map(k => <LayerCheckbox name={k} checked={checkState.get(k)} handleChange={handleChange} key = {`${dataset.name}/${k}`}/>)}
        </Grid>
      </Paper>
    );
  }

export default function Home() {
  const classes = useStyles();
  const datasetsInit: Dataset[] = [];
  const [webgl2State, setWebgl2State] = useState(checkWebGL2());
  const [datasets, setDatasets] = useState(datasetsInit);
  const [appState, setAppState] = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  
  const datasetsPerPage = 10;

  useEffect(() => {
    const datasets = makeDatasets(appState.dataBucket);
    datasets.then(setDatasets);
    datasets.then(a => console.log(`Found datasets: ${String(a)}`));
  }, []);

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const displayedDataSets = datasets.slice(rangeStart, rangeEnd).map((ds, i) => <DatasetPaper dataset={ds} appState={appState} key={`${ds.path}_${rangeStart}_${i}`}/>);
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
            Welcome to the Hess Lab and COSEM Project Team FIBSEM Data Portal. 
            Here we present large volume, high resolution 3D-Electron Microscopy (EM) data, acquired with a 
            focused ion beam milling scanning electron microscope (FIB-SEM) via the Hess lab. Accompanying these EM volumes 
            are automated segmentations of intracellular sub-structures made possible by COSEM. All datasets, training data, 
            and predictions are available for online viewing and download.
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
