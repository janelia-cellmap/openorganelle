import {
  Paper,
  Button,
  Grid,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { ContentTypeEnum as ContentType } from "../api/manifest";
import { LayerTypes, makeQuiltURL } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import {
  DatasetAcquisition,
  DatasetDescriptionSummary
} from "./DatasetDescriptionText";
import DatasetViewList from "./DatasetViewList";
import LayerCheckboxList from "./LayerCheckboxList";
import NeuroglancerLink from "./NeuroglancerLink";
import ClipboardLink from "./ClipboardLink";
import { IView } from "../api/datasets2";

type DatasetPaperProps = {
  datasetKey: string;
};

export interface VolumeCheckStates {
  selected: boolean;
  layerType?: LayerTypes;
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
      margin: theme.spacing(1)
    },
    formcontrol: {
      margin: theme.spacing(1)
    },
    formgroup: {},
    datasetthumbnail: {
      float: "right",
      height: "128px",
      width: "128px",
      margin: "1rem",
      borderRadius: "6px"
    },
    hyperlink: {
      color: theme.palette.info.main
    }
  })
);

export default function DatasetPaper({ datasetKey }: DatasetPaperProps) {
  const classes = useStyles();
  const { appState } = useContext(AppContext);
  const dataset = appState.datasets.get(datasetKey)!;
  const [layerFilter, setLayerFilter] = useState("");
  console.log(dataset.views[0].source_names)
  const volume_names = dataset.volumes.map(d => d.name);
  // remove this when we don't have data on s3 anymore
  const bucket = "janelia-cosem-datasets";
  const prefix = dataset.name;
  const bucketBrowseLink = makeQuiltURL(bucket, prefix);
  const s3URL = `s3://${bucket}/${prefix}/${dataset.name}.n5`;
  const volumeCheckStateInit = new Map<string, VolumeCheckStates>(
    volume_names.map(k => [k, { selected: false, layerType: undefined }])
  );
  // initialize the layer checkboxes by looking at the first dataset view
  for (let vn of volume_names) {
    let vkeys = dataset.views[0].source_names;
    if (vkeys.includes(vn)) {
      volumeCheckStateInit.set(vn, {
        ...volumeCheckStateInit.get(vn),
        selected: true
      });
    }
  }
  // the first view is selected, by default
  const viewCheckStateInit = dataset.views.map((v, idx) => idx === 0);

  const [checkStates, setCheckStates] = useState({
    volumeCheckState: volumeCheckStateInit,
    viewCheckState: viewCheckStateInit
  });

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volumeCheckState = checkStates.volumeCheckState.get(
      event.target.name
    );
    const newCheckState = new Map(
      checkStates.volumeCheckState
        .set(event.target.name, {
          ...volumeCheckState,
          selected: event.target.checked
        })
        .entries()
    );

    // Prevent all checkboxes from being deselected
    if (![...newCheckState.values()].every(v => !v.selected)) {
      setCheckStates({ ...checkStates, volumeCheckState: newCheckState });
    }
  };

  const handleViewChange = (index: number, views: IView[]) => () => {
    const newViewState = checkStates.viewCheckState.map(v => false);
    newViewState[index] = true;

    const newVolumeState = new Map(
      [...checkStates.volumeCheckState.entries()].map(([k, v]) => [
        k,
        { ...v, selected: false }
      ])
    );
    views[newViewState.findIndex(v => v)].source_names.map(k =>
      newVolumeState.set(k, { ...newVolumeState.get(k), selected: true })
    );

    setCheckStates({
      volumeCheckState: newVolumeState,
      viewCheckState: newViewState
    });
  };

  // Update the default layer type for all the affected volumes
  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let contentType: ContentType = event.target.name as ContentType;
    let newLayerType = undefined;
    const newVolumeCheckState = new Map(checkStates.volumeCheckState.entries());
    for (let k of newVolumeCheckState.keys()) {
      let val = newVolumeCheckState.get(k);
      if (
        !(val === undefined) &&
        dataset.volume_map.get(k)?.content_type === contentType
      ) {
        if (event.target.checked) {
          newLayerType = "segmentation" as LayerTypes;
        }
        newVolumeCheckState.set(k, {
          ...val,
          layerType: newLayerType as LayerTypes
        });
      }
    }
    setCheckStates({ ...checkStates, volumeCheckState: newVolumeCheckState });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerFilter(event.target.value);
  };

  const clearLayers = () => {
    const newVolumeCheckState = new Map(
      [...checkStates.volumeCheckState.entries()].map(([k, v]) => [
        k,
        { selected: false }
      ])
    );
    setCheckStates({
      ...checkStates,
      volumeCheckState: newVolumeCheckState
    });
  };

	const thumbnailAlt = `2D rendering of ${dataset.description}`;

  return (
    <Grid container>
      <Grid item md={8}>
        <Paper className={classes.paper} variant="outlined">
          <DatasetDescriptionSummary dataset={dataset}>
            <NeuroglancerLink
              dataset={dataset}
              checkState={checkStates.volumeCheckState}
              view={dataset.views[checkStates.viewCheckState.findIndex(a => a)]}
            >
              <img
								alt={thumbnailAlt}
                src={dataset.thumbnailURL}
                className={classes.datasetthumbnail}
              />
            </NeuroglancerLink>
          </DatasetDescriptionSummary>
        </Paper>
      </Grid>
      <Grid item md={4}>
        <Paper className={classes.paper} variant="outlined">
          <ClipboardLink
            bucketBrowseLink={String(bucketBrowseLink)}
            s3URL={String(s3URL)}
          />
        </Paper>
      </Grid>
      <Grid item sm={12}>
        <Paper className={classes.paper} variant="outlined">
          <Grid container spacing={2}>
            <Grid item sm={10}>
              <NeuroglancerLink
                dataset={dataset}
                checkState={checkStates.volumeCheckState}
                view={
                  dataset.views[checkStates.viewCheckState.findIndex(a => a)]
                }
              />
            </Grid>
            <Grid item sm={2}>
              <Button onClick={clearLayers} variant="outlined">
                Clear Layers
              </Button>
            </Grid>
            <Grid item sm={6}>
              <DatasetViewList
                views={dataset.views}
                handleToggle={handleViewChange}
                checkState={checkStates.viewCheckState}
              />
            </Grid>
            <Grid item sm={6}>
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
      </Grid>
      <Grid item sm={12}>
        <Paper className={classes.paper} variant="outlined">
          <DatasetAcquisition
            s3URL={s3URL}
            bucketBrowseLink={bucketBrowseLink}
            storageLocation={s3URL}
            dataset={dataset}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
