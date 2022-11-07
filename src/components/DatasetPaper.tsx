import {
  Paper,
  Button,
  Grid,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import React, { useState } from "react";
import {LayerType, View, ContentType} from "../api/datasets";
import { makeQuiltURL } from "../api/util";
import {
  DatasetAcquisition,
  DatasetDescriptionSummary
} from "./DatasetDescriptionText";
import DatasetViewList from "./DatasetViewList";
import LayerCheckboxList from "./LayerCheckboxList";
import NeuroglancerLink from "./NeuroglancerLink";
import ClipboardLink from "./ClipboardLink";

import BrokenImage from "../broken_image_24dp.svg";
import { fetchDatasets } from "../context/DatasetsContext";
import { useQuery } from "react-query";

type DatasetPaperProps = {
  datasetKey: string;
};

export interface ImageCheckState {
  selected: boolean;
  layerType?: LayerType;
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
  const [layerFilter, setLayerFilter] = useState("");
  const { isLoading, data, error } = useQuery('datasets', async () => fetchDatasets());
    
  const [checkStates, setCheckStates] = useState({
    images: new Map<string, ImageCheckState>(),
    view: 0
  });
  
  if (isLoading) {
    return <>Loading datasets....</>
  }

  if (error) {
    return <>Error loading datasets: {(error as Error).message}</>
  }

  //const dataset = state.datasets.get(datasetKey)!;
  const dataset = data!.get(datasetKey)!;
  
  
  const imageMap = new Map(dataset.images.map((v) => [v.name, v]))
  const sources: string[] = [...imageMap.keys()];
  // remove this when we don't have data on s3 anymore
  const bucket = "janelia-cosem-datasets";
  const prefix = dataset.name;
  const bucketBrowseLink = makeQuiltURL(bucket, prefix);
  const s3URL = `s3://${bucket}/${prefix}/${dataset.name}.n5`;

  // initialize the layer checkboxes by looking at the first dataset view
  
  for (const vn of sources) {
    const vkeys = dataset.views[0].sourceNames;
    if (vkeys.includes(vn)) {
      checkStates.images.set(vn, {
        ...checkStates.images.get(vn),
        selected: true
      });
    }
  }
  // the first view is selected, by default

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageCheckState = checkStates.images.get(
      event.target.name
    );
    const newCheckState = new Map(
      checkStates.images
        .set(event.target.name, {
          ...imageCheckState,
          selected: event.target.checked
        })
        .entries()
    );

    // Prevent all checkboxes from being deselected
    if (![...newCheckState.values()].every(v => !v.selected)) {
      setCheckStates({ ...checkStates, images: newCheckState });
    }
  };

  const handleViewChange = (index: number, views: View[]) => () => {
    const newViewState = index
    const newImageState = new Map(
      [...checkStates.images.entries()].map(([k, v]) => [
        k,
        { ...v, selected: false }
      ])
    );
    views[newViewState].sourceNames.map(k =>
      newImageState.set(k, { ...newImageState.get(k), selected: true })
    );

    setCheckStates({
      images: newImageState,
      view: newViewState
    });
  };

  // Update the default layer type for all the affected volumes
  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contentType = event.target.name as ContentType;
    let newLayerType = undefined;
    const newImageCheckState = new Map(checkStates.images.entries());
    for (const k of newImageCheckState.keys()) {
      const val = newImageCheckState.get(k);
      if (
        !(val === undefined) &&
        imageMap.get(k)?.contentType === contentType
      ) {
        if (event.target.checked) {
          newLayerType = "segmentation" as LayerType;
        }
        newImageCheckState.set(k, {
          ...val,
          layerType: newLayerType as LayerType
        });
      }
    }
    setCheckStates({ ...checkStates, images: newImageCheckState });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerFilter(event.target.value);
  };

  const clearLayers = () => {
    const newImageCheckState = new Map(
      [...checkStates.images.entries()].map(([k]) => [
        k,
        { selected: false }
      ])
    );
    setCheckStates({
      ...checkStates,
      images: newImageCheckState
    });
  };

	const thumbnailAlt = `2D rendering of ${dataset.name}`;

  return (
    <Grid container>
      <Grid item md={8}>
        <Paper className={classes.paper} variant="outlined">
          <DatasetDescriptionSummary dataset={dataset}>
            <NeuroglancerLink
              dataset={dataset}
              checkState={checkStates.images}
              view={dataset.views[checkStates.view]}
            >
              <img
								alt={thumbnailAlt}
                src={dataset.thumbnailUrl || BrokenImage}
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
                checkState={checkStates.images}
                view={
                  dataset.views[checkStates.view]
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
                checkState={checkStates.view}
              />
            </Grid>
            <Grid item sm={6}>
              <LayerCheckboxList
                dataset={dataset}
                checkState={checkStates.images}
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
            datasetMetadata={dataset}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
