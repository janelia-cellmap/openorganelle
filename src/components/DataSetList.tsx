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
import Checkbox from "@material-ui/core/Checkbox";
import thumbnail from "./cosem_logo.png";
import { AppContext} from "../context/AppContext";

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
    datasetThumbnail: {
    }
  })
);

type NeuroglancerLinkProps = {
  dataset: Dataset;
  volumeNames: string[];
};

type DatasetPaperProps = {
  datasetKey: string;
};

type LayerCheckBoxListProps = {
  volumeNames: string[];
  dataset: Dataset;
  checkState: Map<string, boolean>;
  handleChange: any;
}

const LayerCheckboxList: FunctionComponent<LayerCheckBoxListProps> = (props: LayerCheckBoxListProps) => {
  const classes = useStyles();
  console.log(props)
  const checkboxes = props.volumeNames.map(k => (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.checkState.get(k)}
          onChange={props.handleChange}
          name={k}
          size="small"
        />
      }
      label={k}
      key={`${props.dataset.key}/${k}`}
    />
  ));
  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Select layers</FormLabel>
      <FormGroup className={classes.formGroup}>{checkboxes}</FormGroup>
    </FormControl>
  );
};


const NeuroglancerLink: FunctionComponent<NeuroglancerLinkProps> = (props: NeuroglancerLinkProps) => {

  const [appState, setAppState] = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;
  const key = `${props.dataset.key}_${props.volumeNames.join("_")}`;
  const displayVolumes: Volume[] = props.volumeNames.map(k =>
    props.dataset.volumes.get(k));

  if (displayVolumes.length == 0) {return <div> No layers selected </div>}
  else {
  return (
    <div key={key}>
      <a
        href={`${
          neuroglancerAddress
          }${props.dataset.makeNeuroglancerViewerState(displayVolumes)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View with Neuroglancer
      </a>
      <LaunchIcon />
      {!webGL2Enabled && <WarningIcon />}
    </div>
  );
}};

export const DatasetPaper: FunctionComponent<DatasetPaperProps> = ({datasetKey}) => {
  const classes = useStyles();
  const [appState, setAppState] = useContext(AppContext);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckState = new Map(
      checkState.set(event.target.name, event.target.checked).entries()
    );
    // Prevent all checkboxes from being deselected
    if (![... newCheckState.values()].every(v => !v)) {
      setCheckState(newCheckState);
    }
  };
  const dataset: Dataset = appState.datasets.get(datasetKey);
  const volumeNames: string[] = [... dataset.volumes.keys()];
 
  const checkStateInit = new Map<string, boolean>();
  volumeNames.forEach(v => checkStateInit.set(v, true));
  const [checkState, setCheckState] = useState(checkStateInit);
       
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
              checkState={checkState}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item>
          <NeuroglancerLink
              dataset={dataset}
              volumeNames={volumeNames.filter(v => checkState.get(v))}
            />
          </Grid>
        </Grid>
        <Grid item>
          <CardMedia
            style={{ height: 256, width: 256, borderRadius: "10%" }}
            image={dataset.thumbnailPath}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default function DataSetPaperList() {
  const [appState, setAppState] = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 10;

  const datasets: Map<string, Dataset> = appState.datasets;

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.size / datasetsPerPage);

  const displayedDataSets = Array.from(datasets.keys())
    .slice(rangeStart, rangeEnd)
    .map((k, i) => (
      <DatasetPaper
        datasetKey={k}
        key={`${k}_${rangeStart}_${i}`}
      />
    ));

  return (
    <div>
      <Typography variant="h5">
        Datasets {rangeStart + 1} to {Math.min(rangeEnd, datasets.size)} of{" "}
        {datasets.size}
      </Typography>
      {datasets.size > datasetsPerPage && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      )}
      {displayedDataSets}
      {datasets.size > datasetsPerPage && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      )}
    </div>
  );
}
