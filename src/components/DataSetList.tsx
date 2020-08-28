import React, {
  useEffect,
  useState,
  useContext,
  FunctionComponent
} from "react";
import Markdown from "react-markdown/with-html";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Grid, Divider, CardMedia } from "@material-ui/core";
import { makeDatasets, Dataset, Volume } from "../api/datasets";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import thumbnail from "./cosem_logo.png";
import { AppContext } from "../context/AppContext";
import { borders } from '@material-ui/system';
import {Box} from "@material-ui/core";
const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      margin: theme.spacing(2)
    },
    grid: {},
    markdown: {
      textAlign: "left"
    },
    formControl: {
      margin: theme.spacing(1)
    },
    formGroup: {},
    datasetThumbnail:{
    }
  })
);

export default function DataSetList() {
  const datasetsInit: Dataset[] = [];
  const [datasets, setDatasets] = useState(datasetsInit);
  const [appState, setAppState] = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);

  const datasetsPerPage = 10;

  useEffect(() => {
    const datasets = makeDatasets(appState.dataBucket);
    datasets.then(setDatasets);
    datasets.then(a => console.log(`Found datasets: ${String(a)}`));
  }, []);

  type NeuroglancerLinkProps = {
    appState: any;
    dataset: Dataset;
    volumeNames: string[];
  };

  type DatasetPaperProps = {
    dataset: Dataset;
    appState: any;
  };

  const LayerCheckboxList: FunctionComponent<any> = ({
    volumeNames,
    dataset,
    checkstate,
    handleChange
  }) => {
    const classes = useStyles();
    const checkboxes = volumeNames.map(k => (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkstate.get(k)}
            onChange={handleChange}
            name={k}
            size="small"
          />
        }
        label={k}
        key={`${dataset.key}/${k}`}
      />
    ));
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select layers</FormLabel>
        <FormGroup className={classes.formGroup}>{checkboxes}</FormGroup>
      </FormControl>
    );
  };

  class ErrorBoundary extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    componentDidCatch(error: any, info: any) {
      // Display fallback UI
      this.setState({ hasError: true });
      // You can also log the error to an error reporting service
      console.log(error, info);
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
      return this.props.children;
    }
  }

  const NeuroglancerLink: FunctionComponent<NeuroglancerLinkProps> = ({
    appState,
    dataset,
    volumeNames
  }) => {
    const displayVolumes: Volume[] = volumeNames.map(k =>
      dataset.volumes.get(k)
    );
    const key = `${dataset.key}_${volumeNames.join("_")}`;
    return (
      <div key={key}>
        <a
          href={`${
            appState.neuroglancerAddress
          }${dataset.makeNeuroglancerViewerState(displayVolumes)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View with Neuroglancer
        </a>
        <LaunchIcon />
        {!appState.webGL2Enabled && <WarningIcon />}
      </div>
    );
  };

  const DatasetPaper: FunctionComponent<DatasetPaperProps> = ({
    dataset,
    appState
  }) => {
    console.log(dataset.volumes);
    const classes = useStyles();
    const volumeNames: string[] = Array.from(dataset.volumes.keys());
    const checkStateInit = new Map<string, boolean>();
    volumeNames.forEach(v => checkStateInit.set(v, true));
    const [checkState, setCheckState] = useState(checkStateInit);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCheckState = new Map(
        checkState.set(event.target.name, event.target.checked).entries()
      );
      const vals = Array.from(newCheckState.values());
      // Prevent all checkboxes from being deselected
      if (!vals.every(v => !v)) {
        setCheckState(newCheckState);
      }
    };
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          className={classes.grid}
          spacing={2}
          direction="row"
          justify="space-around"
          alignItems="stretch"
        >
          <Grid item>
            <Markdown
              className={classes.markdown}
              source={dataset.readme.content}
              escapeHtml={false}
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            xs={4}
            spacing={2}
            justify="flex-end"
          >
            <Grid item>
              <LayerCheckboxList
                volumeNames={volumeNames}
                dataset={dataset}
                checkstate={checkState}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item>
              <NeuroglancerLink
                appState={appState}
                dataset={dataset}
                volumeNames={volumeNames.filter(v => checkState.get(v))}
                webgl2State={appState.webGL2Enabled}
              />
            </Grid>
          </Grid>
          <Grid item>
            <CardMedia 
            style={{height: 256, width: 256, borderRadius: "10%"}}
            image={dataset.thumbnailPath}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };
  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const displayedDataSets = datasets
    .slice(rangeStart, rangeEnd)
    .map((ds, i) => (
      <DatasetPaper
        dataset={ds}
        appState={appState}
        key={`${ds.key}_${rangeStart}_${i}`}
      />
    ));

  return (
    <div>
      <Typography variant="h5">
        Datasets {rangeStart + 1} to {Math.min(rangeEnd, datasets.length)} of{" "}
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
    </div>
  );
}
