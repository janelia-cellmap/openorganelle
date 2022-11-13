import {
  Paper,
  Button,
  Grid,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import React, { useState } from "react";
import {LayerType, View, ContentType} from "../types/datasets";
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
import { fetchDatasets } from "../api/datasets";
import { useQuery } from "react-query";
import { fetchViews } from "../api/views";

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
  const datasetsLoader = useQuery('datasets', async () => fetchDatasets());
  const viewsLoader = useQuery('views', async () => fetchViews());
  
  const [checkStates, setCheckStates] = useState({
    images: new Map<string, ImageCheckState>(),
    view: 0
  });
  
  if (datasetsLoader.isLoading || viewsLoader.isLoading) {
    return <>Loading metadatata....</>
  }

  if (datasetsLoader.error) {
    return <>Error loading metadata: {(datasetsLoader.error as Error).message}</>
  }

  if (viewsLoader.error) {
    return <>Error loading metadata: {(viewsLoader.error as Error).message}</>
  }


  const dataset = datasetsLoader.data!.get(datasetKey)!;
  const views = viewsLoader.data!.filter(v => v.datasetName === datasetKey) 
  
  const imageMap = new Map(dataset.images.map((v) => [v.name, v]))
  const sources: string[] = [...imageMap.keys()];

  const bucket = "janelia-cosem-datasets";
  const prefix = dataset.name;
  const bucketBrowseLink = makeQuiltURL(bucket, prefix);
  const s3URL = `s3://${bucket}/${prefix}/${dataset.name}.n5`;

  // initialize the layer checkboxes by looking at the first dataset view
  
  for (const vn of sources) {
    const vkeys = views[0].images.map(v => v.name);
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
    views[newViewState].images.map(k =>
      newImageState.set(k.name, { ...newImageState.get(k.name), selected: true })
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
  const local_view = views[checkStates.view]
  return (
    <Grid container>
      <Grid item md={8}>
        <Paper className={classes.paper} variant="outlined">
          <DatasetDescriptionSummary dataset={dataset}>
            <NeuroglancerLink 
                position={local_view.position ?? undefined} 
                scale={local_view.scale ?? undefined}
                orientation={local_view.orientation ?? undefined}
                images = {local_view.images}
                
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
