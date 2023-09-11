import {
  Paper,
  Button,
  Grid,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import React, { useState } from "react";
import {View} from "../types/database";
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
import {fetchViews} from "../api/views"

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
  
  const datasetsLoader = useQuery('datasets', async () => fetchDatasets());
  const viewsLoader = useQuery('views', async () => fetchViews());
 
  const [layerFilter, setLayerFilter] = useState("");
  const [imageChecked, setImageChecked] = useState(new Set<string>())
  const [viewChecked, setViewChecked] = useState(0)
 
  if (datasetsLoader.isLoading || viewsLoader.isLoading) {
    return <>Loading metadatata....</>
  }

  else if (datasetsLoader.error || viewsLoader.error) {
    const err = datasetsLoader.error ? datasetsLoader.error : viewsLoader.error
    return <>Error loading metadata: {err as Error}</>
  }
  else {
    if (datasetsLoader.data === undefined || viewsLoader.data === undefined) {
      return <>Error loading metadata. Fetch succeeded but payload was undefined.</>
    }
    else if (datasetsLoader.data.get(datasetKey) === undefined) {
      return <>Error parsing metadata. Fetch succeeded but a dataset named {datasetKey} could not be found.</>
    }
  }

  const dataset = datasetsLoader.data.get(datasetKey)!;
  const views = viewsLoader.data.filter(v => (v.datasetName === datasetKey && v.description !== '')) 
  if (views.length == 0) {
    // insert default view
    views.push({
      name: 'Default view', 
      description: 'The default view of the data',
      thumbnailUrl: null,
      createdAt: new Date(),
      datasetName: dataset.name,
      position: null,
      scale: null,
      orientation: null,
      taxa: [],
      tags: [],
      stage: 'prod',
      imagery: dataset.imagery.filter(im => im.contentType == 'em')
})
  }
  const bucket = "janelia-cosem-datasets";
  const prefix = dataset.name;
  const bucketBrowseLink = makeQuiltURL(bucket, prefix);
  const s3URL = `s3://${bucket}/${prefix}/${dataset.name}.n5`;
  

  // initialize the checkboxes with the first view
  const imageNames = [...dataset.imagery.map(v => v.name)]
  const inView = imageNames.filter(name => views[viewChecked].imagery.map(v => v.name).includes(name))
  if (imageChecked.size == 0) {
    inView.forEach(name => imageChecked.add(name))
  }
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImageChecked = new Set([...imageChecked])
    if (event.target.checked) {
      newImageChecked.add(event.target.name)
    }
    else {
      // prevent all image checkboxes from being deselected
      if (newImageChecked.size > 1) {
        newImageChecked.delete(event.target.name)
      }
    }
    setImageChecked(newImageChecked)
    }

  const handleViewChange = (index: number, views: View[]) => () => {
    const newImageState = views[index].imagery.reduce((previous, current) =>
      previous.add(current.name), new Set<string>());

    setViewChecked(index)
    setImageChecked(newImageState)
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerFilter(event.target.value);
  };

  const clearLayers = () => {
    setImageChecked(new Set<string>())
  };

	const thumbnailAlt = `2D rendering of ${dataset.name}`;
  const localView = {...views[viewChecked], imagery: dataset.imagery.filter(v => imageChecked.has(v.name))} 
  return (
    <Grid container>
      <Grid item md={8}>
        <Paper className={classes.paper} variant="outlined">
          <DatasetDescriptionSummary dataset={dataset}>
            <NeuroglancerLink 
                position={views[viewChecked].position} 
                scale={views[viewChecked].scale}
                orientation={views[viewChecked].orientation}
                imagery = {views[viewChecked].imagery}
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
                  scale= {localView.scale}
                  position= {localView.position}
                  orientation= {localView.orientation}
                  imagery= {localView.imagery}
              />
            </Grid>
            <Grid item sm={2}>
              <Button onClick={clearLayers} variant="outlined">
                Clear Layers
              </Button>
            </Grid>
            <Grid item sm={6}>
              <DatasetViewList
                views={views}
                handleToggle={handleViewChange}
                checkState={viewChecked}
              />
            </Grid>
            <Grid item sm={6}>
              <LayerCheckboxList
                dataset={dataset}
                checkState={imageChecked}
                handleImageChange={handleImageChange}
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
