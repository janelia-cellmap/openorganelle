import {
  Paper,
  Button,
  Grid,
  CardActionArea,
  CardMedia,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Dataset, DatasetView } from "../api/datasets";
import { bucketNameToURL } from "../api/datasources";
import { AppContext } from "../context/AppContext";
import { DatasetDescriptionFull } from "./DatasetDescriptionText";
import DatasetViewList from "./DatasetViewList";
import LayerCheckboxList from "./LayerCheckboxList";
import NeuroglancerLink from "./NeuroglancerLink";

type DatasetPaperProps = {
  datasetKey: string;
};

interface CheckStates {
  layerCheckState: Map<string, boolean>;
  viewCheckState: boolean[];
}

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
      margin: theme.spacing(2)
    },
    formcontrol: {
      margin: theme.spacing(1)
    },
    formgroup: {},
    datasetthumbnail: {},
    hyperlink: {
      color: theme.palette.info.main
    }
  })
);

export default function DatasetPaper({ datasetKey }: DatasetPaperProps) {
  const classes = useStyles();
  const {appState, setAppState} = useContext(AppContext);
  const dataset: Dataset = appState.datasets.get(datasetKey)!;

  const volumeNames: string[] = [...dataset.volumes.keys()];
  const layerCheckStateInit = new Map<string, boolean>(
    volumeNames.map(k => [k, false])
  );
  // initialize the layer checkboxes by looking at the first dataset view
  for (let vn of volumeNames) {
    let vkeys = dataset.views[0].volumeKeys;
    if (vkeys.includes(vn)) {
      layerCheckStateInit.set(vn, true);
    }
  }
  // the first view is selected, by default
  const viewCheckStateInit = dataset.views.map((v, idx) => idx === 0);

  const [checkStates, setCheckStates] = useState({
    layerCheckState: layerCheckStateInit,
    viewCheckState: viewCheckStateInit
  });

  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckState = new Map(
      checkStates.layerCheckState
        .set(event.target.name, event.target.checked)
        .entries()
    );
    // Prevent all checkboxes from being deselected
    if (![...newCheckState.values()].every(v => !v)) {
      setCheckStates({ ...checkStates, layerCheckState: newCheckState });
    }
  };

  const handleViewToggle = (index: number, views: DatasetView[]) => () => {
    const newViewState = checkStates.viewCheckState.map(v => false);
    newViewState[index] = true;

    const newLayerState = new Map(
      [...checkStates.layerCheckState.entries()].map(([k, v]) => [k, false])
    );
    views[newViewState.findIndex(v => v)].volumeKeys.map(k =>
      newLayerState.set(k, true)
    );

    setCheckStates({
      ...checkStates,
      layerCheckState: newLayerState,
      viewCheckState: newViewState
    });
  };

  const clearLayers = () => {
    console.log("clearing layers");
    const newLayerState = new Map(
      [...checkStates.layerCheckState.entries()].map(([k, v]) => [k, false])
    );
    setCheckStates({
      ...checkStates,
      layerCheckState: newLayerState
    });
  };

  const datasetLink = `/datasets/${dataset.key}`;
	const clipLink = `${bucketNameToURL(appState.dataBucket)}/${dataset.key}/${dataset.key}.n5`;

  return (
    <>
      <Paper className={classes.paper} variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <DatasetDescriptionFull
							clipLink = {clipLink}
              datasetDescription={dataset.description}
              titleLink={datasetLink}
            />
          </Grid>
          <Grid item xs={2}>
            <NeuroglancerLink
              dataset={dataset}
              checkState={checkStates.layerCheckState}
              view={dataset.views[checkStates.viewCheckState.findIndex(a => a)]}
            >
              <CardActionArea>
                <CardMedia
                  style={{ height: 128, width: 128, borderRadius: "10%" }}
                  image={dataset.thumbnailPath}
                />
              </CardActionArea>
            </NeuroglancerLink>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper} variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <NeuroglancerLink
              dataset={dataset}
              checkState={checkStates.layerCheckState}
              view={dataset.views[checkStates.viewCheckState.findIndex(a => a)]}
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={clearLayers} variant="outlined">
              Clear Layers
            </Button>
          </Grid>
          <Grid item xs={6}>
            <DatasetViewList
              views={dataset.views}
              handleToggle={handleViewToggle}
              checkState={checkStates.viewCheckState}
            />
          </Grid>
          <Grid item xs={6}>
            <LayerCheckboxList
              dataset={dataset}
              checkState={checkStates.layerCheckState}
              handleChange={handleLayerChange}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
