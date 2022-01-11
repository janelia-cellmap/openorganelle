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
import {ContentTypeEnum as ContentType, DatasetView} from "../api/manifest";
import { Dataset, LayerTypes } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import { DatasetDescriptionFull } from "./DatasetDescriptionText";
import DatasetViewList from "./DatasetViewList";
import LayerCheckboxList from "./LayerCheckboxList";
import NeuroglancerLink from "./NeuroglancerLink";

type DatasetPaperProps = {
  datasetKey: string;
};

export interface VolumeCheckStates {
  selected: boolean
  layerType?: LayerTypes
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
  const {appState} = useContext(AppContext);
  const dataset: Dataset = appState.datasets.get(datasetKey)!;
  const [layerFilter, setLayerFilter] = useState("");

  const sources: string[] = [...dataset.volumes.keys()];

	const bucketBrowseLink = `https://open.quiltdata.com/b/${appState.dataBucket}/tree/${dataset.name}/`;
  const s3URL = `s3://${appState.dataBucket}/${dataset.name}/${dataset.name}.n5`;

  const volumeCheckStateInit = new Map<string, VolumeCheckStates>(
    sources.map(k => [k, {selected: false, layerType: undefined}])
  );
  // initialize the layer checkboxes by looking at the first dataset view
  for (let vn of sources) {
    let vkeys = dataset.views[0].sources;
    if (vkeys.includes(vn)) {
      volumeCheckStateInit.set(vn, {...volumeCheckStateInit.get(vn), selected: true});
    }
  }
  // the first view is selected, by default
  const viewCheckStateInit = dataset.views.map((v, idx) => idx === 0);
  
  const [checkStates, setCheckStates] = useState({
    volumeCheckState: volumeCheckStateInit,
    viewCheckState: viewCheckStateInit,
  });

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volumeCheckState = checkStates.volumeCheckState.get(event.target.name);
    const newCheckState = new Map(
      checkStates.volumeCheckState
        .set(event.target.name, {...volumeCheckState, selected: event.target.checked})
        .entries()
    );

    // Prevent all checkboxes from being deselected
    if (![...newCheckState.values()].every(v => !v.selected)) {
      setCheckStates({ ...checkStates, volumeCheckState: newCheckState });
    }
  };

  const handleViewChange = (index: number, views: DatasetView[]) => () => {
    const newViewState = checkStates.viewCheckState.map(v => false);
    newViewState[index] = true;

    const newVolumeState = new Map(
      [...checkStates.volumeCheckState.entries()].map(([k, v]) => [k, {...v, selected: false}])
    );
    views[newViewState.findIndex(v => v)].sources.map(k =>
      newVolumeState.set(k, {...newVolumeState.get(k), selected: true})
    );

    setCheckStates({
      volumeCheckState: newVolumeState,
      viewCheckState: newViewState
    });
  };


 // Update the default layer type for all the affected volumes
  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let contentType: ContentType = (event.target.name as ContentType);
    let newLayerType = undefined;
    const newVolumeCheckState = new Map(checkStates.volumeCheckState.entries());
    for (let k of newVolumeCheckState.keys()){
      let val = newVolumeCheckState.get(k);
      if (!(val === undefined) && (dataset.volumes.get(k)?.contentType === contentType)) {
        if (event.target.checked) {newLayerType=('segmentation' as LayerTypes)}
        newVolumeCheckState.set(k, {...val, layerType: (newLayerType as LayerTypes)})
      }
    }
    setCheckStates({ ...checkStates, volumeCheckState: newVolumeCheckState});
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerFilter(event.target.value);
  };


  const clearLayers = () => {
    const newVolumeCheckState = new Map(
      [...checkStates.volumeCheckState.entries()].map(([k, v]) => [k, {selected: false}])
    );
    setCheckStates({
      ...checkStates,
      volumeCheckState: newVolumeCheckState
    });
  };

  return (
    <>
      <Paper className={classes.paper} variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <DatasetDescriptionFull
              s3URL = {s3URL}
              bucketBrowseLink = {bucketBrowseLink}
              storageLocation={s3URL}
              datasetMetadata={dataset.description}
            />
          </Grid>
          <Grid item xs={2}>
            <NeuroglancerLink
              dataset={dataset}
              checkState={checkStates.volumeCheckState}
              view={dataset.views[checkStates.viewCheckState.findIndex(a => a)]}
            >
              <CardActionArea>
                <CardMedia
                  style={{ height: 128, width: 128, borderRadius: "10%" }}
                  image={dataset.thumbnailURL}
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
              checkState={checkStates.volumeCheckState}
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
              handleToggle={handleViewChange}
              checkState={checkStates.viewCheckState}
            />
          </Grid>
          <Grid item xs={6}>
            <LayerCheckboxList
              dataset={dataset}
              checkState={checkStates.volumeCheckState}
              handleVolumeChange={handleVolumeChange}
              handleLayerChange={handleLayerChange}
              handleFilterChange={handleFilterChange}
              filter={layerFilter}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
