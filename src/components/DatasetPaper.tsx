import {
  Paper,
  Button,
  Grid,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import React, { useState } from "react";
import {LayerType, View, ContentType, Image} from "../api/datasets";
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

type DatasetPaperProps = {
  datasetKey: string;
};


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
  
  if (isLoading) {
    return <>Loading datasets....</>
  }

  if (error) {
    return <>Error loading datasets: {(error as Error).message}</>
  }

  const dataset = data!.get(datasetKey)!;
  const thumbnailAlt = `2D rendering of ${dataset.name}`;
  // only display views with descriptions
  const views = dataset.views
  const primaryViewIndex: number = views.findIndex((v) => v.name == 'Default view') ?? 0;

  const [viewCheckState, setViewCheckStates] = useState(primaryViewIndex);
  const [imageCheckState, setImageCheckState] = useState<Set<string>>(new Set(views[primaryViewIndex].sourceNames))
  

  const imageMap = new Map(dataset.images.map((v) => [v.name, v]))
  const sources = [...imageMap.keys()];
  // remove this when we don't have data on s3 anymore
  const bucket = "janelia-cosem-datasets";
  // TODO: clean this up
  const prefix = dataset.name;
  const bucketBrowseLink = makeQuiltURL(bucket, prefix);
  const s3URL = `s3://${bucket}/${prefix}/${dataset.name}.n5`;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked){
      imageCheckState.add(event.target.name)
      }
      else {
        imageCheckState.delete(event.target.name)
      }
      setImageCheckState(new Set(imageCheckState))
    }

  const handleViewChange = (index: number, views: View[]) => () => {
    const newViewState = index
    const newImageState = views[newViewState].sourceNames.reduce(
      (accum: Set<string>, val: string) => {return accum.add(val)}, new Set<string>())
    
    setViewCheckStates(newViewState);
    setImageCheckState(newImageState);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerFilter(event.target.value);
  };

  const clearLayers = () => {
    const newImageState = views[viewCheckState].sourceNames.reduce(
      (accum: Set<string>, val: string) => {return accum.add(val)}, new Set<string>())
    setImageCheckState(newImageState);
  };

  return (
    <Grid container>
      <Grid item md={8}>
        <Paper className={classes.paper} variant="outlined">
          <DatasetDescriptionSummary dataset={dataset}>
            <NeuroglancerLink
              dataset={dataset}
              imageNames={imageCheckState}
              view={dataset.views[viewCheckState]}
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
                imageNames={imageCheckState}
                view={
                  views[viewCheckState]
                }
              />
            </Grid>
            <Grid item sm={2}>
              <Button onClick={clearLayers} variant="outlined">
                Clear Layers
              </Button>
            </Grid>
            <Grid item sm={6}>
              <LayerCheckboxList
                images={dataset.images}
                checkState={imageCheckState}
                handleImageChange={handleImageChange}
                handleFilterChange={handleFilterChange}
                filter={layerFilter}
              />
            </Grid>
            <Grid item sm={6}>
              <DatasetViewList
                views={views}
                handleToggle={handleViewChange}
                checkState={viewCheckState}
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
