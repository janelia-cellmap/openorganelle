import React, {
  useState,
  useContext,
  FunctionComponent
} from "react";
import { Link as RouterLink } from 'react-router-dom';
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Grid, Divider, CardMedia, CardActionArea, Link, Box } from "@material-ui/core";
import {Dataset, Volume, ContentType} from "../api/datasets";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { AppContext} from "../context/AppContext";
import {DatasetDescription} from "../api/dataset_description";
import ReactHtmlParser from 'react-html-parser';
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
    },
    hyperlink: {
      color: theme.palette.info.main
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


type DescriptionTextProps = {
  titleLink: string
  datasetDescription: DatasetDescription
}

const DescriptionText: FunctionComponent<DescriptionTextProps> = (props: DescriptionTextProps) => {
  const classes = useStyles();
  const description = props.datasetDescription;

  return <Box>
    <Link href={props.titleLink} className={classes.hyperlink} variant="h6">{ReactHtmlParser(description.Title)}</Link>
    {[...Object.keys(description.Summary)].map(p => <p key={p}><strong>{ReactHtmlParser(p)}</strong>: {ReactHtmlParser(description.Summary[p])}</p>)}
  </Box>

}

const LayerCheckboxList: FunctionComponent<LayerCheckBoxListProps> = (props: LayerCheckBoxListProps) => {
  const classes = useStyles();
  const checkboxGroups: Map<ContentType, JSX.Element[]> = new Map();

  props.dataset.volumes.forEach((volume: Volume, key: string)  => {

    let cb = <FormControlLabel
    control={
      <Checkbox
        checked={props.checkState.get(key)}
        onChange={props.handleChange}
        color="primary"
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
    <Grid item>
    <Typography variant="h6">Select layers</Typography>
    <FormControl component="fieldset" className={classes.formControl}>
    <FormLabel component="legend">EM</FormLabel>
    <Divider/>
    <FormGroup className={classes.formGroup}>{checkboxGroups.get('em')}</FormGroup>
    <FormLabel component="legend">Segmentation</FormLabel>
    <Divider/>
    <FormGroup className={classes.formGroup}>{checkboxGroups.get('segmentation')}</FormGroup>
    </FormControl>
    </Grid>
  );
};


const NeuroglancerLink: FunctionComponent<NeuroglancerLinkProps> = (props: NeuroglancerLinkProps) => {
  const classes = useStyles();
  const [appState, ] = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;
  const key = `${props.dataset.key}_NeuroglancerLink`;
  const displayVolumes: Volume[] = [];
  props.dataset.volumes.forEach((value: Volume, key: string)  => {
    if (props.checkState.get(key)) {displayVolumes.push(value)}});

  if (displayVolumes.length === 0) {return <div> No layers selected </div>}
  else {
  return (
    <Box key={key}>
      <Link
        className={classes.hyperlink}
        href={`${
          neuroglancerAddress
          }${props.dataset.makeNeuroglancerViewerState(displayVolumes)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View with Neuroglancer
      </Link>
      <LaunchIcon fontSize="small"/>
      {!webGL2Enabled && <WarningIcon />}
    </Box>
  );
}};

export const DatasetPaper: FunctionComponent<DatasetPaperProps> = (props: DatasetPaperProps) => {
  const classes = useStyles();
  const [appState,] = useContext(AppContext);
  const datasetKey = props.datasetKey;
  const dataset: Dataset = appState.datasets.get(datasetKey);
  const checkStateInit = new Map<string, boolean>();
  [...dataset.volumes.keys()].forEach((key) => {
     checkStateInit.set(key, true)
  });
  const [checkState, setCheckState] = useState(checkStateInit);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckState = new Map(
      checkState.set(event.target.name, event.target.checked).entries()
    );
    // Prevent all checkboxes from being deselected
    if (![...newCheckState.values()].every(v => !v)) {
      setCheckState(newCheckState);
    }
  };

  const datasetLink = `/datasets/${dataset.key}`;

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
        <DescriptionText datasetDescription={dataset.description} titleLink={datasetLink}/>
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
        <Grid item xs={4}>
          <CardActionArea component={RouterLink} to={datasetLink}>
            <CardMedia
              style={{ height: 256, width: 256, borderRadius: "10%" }}
              image={dataset.thumbnailPath}
            />
          </CardActionArea>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default function DataSetPaperList() {
  const [appState,] = useContext(AppContext);
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
