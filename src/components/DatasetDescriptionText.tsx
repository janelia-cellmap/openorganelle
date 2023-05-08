import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Publication, Dataset } from "../types/database";

export interface DescriptionPreviewProps {
  title: string;
  startDate: string;
  id: string;
  gridSpacingUnit: string;
  gridSpacing: number[]
  gridDimensions: number[]
  gridDimensionsUnit: string
  titleLink: string;
}

export interface DescriptionSummaryProps {
  children: any;
  dataset: Dataset;
}

export interface DescriptionFullProps {
  s3URL: string;
  bucketBrowseLink: string;
  storageLocation: string;
  datasetMetadata: Dataset;
}

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main
    }
  })
);

interface PublicationListProps {
  publications: Publication[]
}

export function PublicationList({publications}: PublicationListProps) {
  return (<ul>{publications.map(link => {
    return <li key={link.url + link.name}><a href={link.url}>{link.name}</a></li>    
})}</ul>)
} 

export function DatasetDescriptionPreview({
  title, startDate, id, gridSpacing, gridDimensions, gridSpacingUnit, gridDimensionsUnit}: DescriptionPreviewProps) {
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <p>
        <strong>Acquisition date</strong>: {startDate}
      </p>
      <p>
        <strong>Dataset ID</strong>: {id}
      </p>
      <p>
        <strong>Voxel size ({gridSpacingUnit})</strong>
        : {gridSpacing}
      </p>
      <p>
        <strong>Dimensions ({gridDimensionsUnit})</strong>:{" "}
        {gridDimensions}
      </p>
    </Box>
  );
}

export function DatasetAcquisition({
  storageLocation,
  datasetMetadata
}: DescriptionFullProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        Acquisition details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <p>
            <strong>
              Final voxel size ({datasetMetadata.imageAcquisition.gridSpacingUnit})
            </strong>
            : {datasetMetadata.imageAcquisition.gridSpacing}
          </p>
          <p>
            <strong>
              Dimensions ({datasetMetadata.imageAcquisition.gridDimensionsUnit})
            </strong>
            : {datasetMetadata.imageAcquisition.gridDimensions}
          </p>
          <p>
            <strong>Dataset ID</strong>: {datasetMetadata.name}
          </p>
            <strong>DOI</strong>:{" "}
            <PublicationList publications={datasetMetadata.publications.filter((p) => p.type == 'doi')}/>
            <strong>Publications</strong>:{" "}
            <PublicationList publications={datasetMetadata.publications.filter((p) => p.type == 'paper')}/>
          <p>
            <strong>Dataset location</strong>: {storageLocation}
          </p>
        </Grid>
      </Grid>
    </>
  );
}

export function DatasetDescriptionSummary({
  dataset,
  children
}: DescriptionSummaryProps) {
  const classes = useStyles();
  return (
    <>
      {children}
      <Typography variant="h6" className={classes.title}>
        {dataset.description}
      </Typography>
      <p>
        <strong>Sample</strong>: {dataset.sample!.description}
      </p>
      <p>
        <strong>Protocol</strong>: {dataset.sample!.protocol}
      </p>
      <p>
        <strong>Contributions</strong>: {dataset.sample!.contributions}
      </p>
    </>
  );
}
