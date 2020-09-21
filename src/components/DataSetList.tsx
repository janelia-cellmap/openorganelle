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
import {Dataset, Volume, ContentType} from "../api/datasets";
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
  checkState: Map<string, boolean>;
};

type DatasetPaperProps = {
  datasetKey: string;
};

type LayerCheckBoxListProps = {
  dataset: Dataset;
  checkState: Map<string, boolean>;
  handleChange: any;
}

/* placeholder for when I start parsing the description from json 
type DatasetDescriptionProps = {
  
}

const DatasetDescription: FunctionComponent<DatasetDescriptionProps> = (props: DatasetDescriptionProps) => 
{

}
*/

const LayerCheckboxList: FunctionComponent<LayerCheckBoxListProps> = (props: LayerCheckBoxListProps) => {
  const classes = useStyles();
  const checkboxGroups: Map<ContentType, JSX.Element[]> = new Map();
  
  props.dataset.volumes.forEach((volume: Volume, key: string)  => {
    
    let cb = <FormControlLabel
    control={
      <Checkbox
        checked={props.checkState.get(key)}
        onChange={props.handleChange}
        name={key}
        size="small"
      />
    }
    label={volume.name}
    key={`${props.dataset.key}/${key}`}
  />;
    
    if (checkboxGroups.get(volume.contentType) === undefined) {checkboxGroups.set(volume.contentType, [])}
    checkboxGroups.get(volume.contentType).push(cb);
    });
    
  return (
    <FormControl component="fieldset" className={classes.formControl}>
    <FormLabel component="legend">Select layers</FormLabel>
    
    <FormLabel component="legend">EM</FormLabel>
    <Divider/>
    <FormGroup className={classes.formGroup}>{checkboxGroups.get('em')}</FormGroup>
    <FormLabel component="legend">Segmentation</FormLabel>
    <Divider/>
    <FormGroup className={classes.formGroup}>{checkboxGroups.get('segmentation')}</FormGroup>
    </FormControl>
  );
};


const NeuroglancerLink: FunctionComponent<NeuroglancerLinkProps> = (props: NeuroglancerLinkProps) => {

  const [appState, setAppState] = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;
  const key = `${props.dataset.key}_NeuroglancerLink`;
  const displayVolumes: Volume[] = [];
  props.dataset.volumes.forEach((value: Volume, key: string)  => {
    if (props.checkState.get(key)) {displayVolumes.push(value)}});
  
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
  const dataset: Dataset = appState.datasets.get(datasetKey);  
  const checkStateInit = new Map<string, boolean>();
  for (let [key, value] of dataset.volumes.entries()) {
     checkStateInit.set(key, true)
  }
  const [checkState, setCheckState] = useState(checkStateInit);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckState = new Map(
      checkState.set(event.target.name, event.target.checked).entries()
    );
    // Prevent all checkboxes from being deselected
    if (![... newCheckState.values()].every(v => !v)) {
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
        <Grid item xs={4}>
          <Markdown
            className={classes.markdown}
            source={dataset.readme.content}
            escapeHtml={false}
          />
        </Grid>
        <Divider orientation="vertical" flexItem={true}></Divider>
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
              dataset={dataset}
              checkState={checkState}
              handleChange={handleChange}
            />
          </Grid> 
          <Grid item>
          <NeuroglancerLink
              dataset={dataset}
              checkState={checkState}
            />
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem={true}></Divider>
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
