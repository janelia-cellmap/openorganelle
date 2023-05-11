import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Publication, Dataset } from "../types/database";

export interface DescriptionPreviewProps {
  title: string;
  startDate: Date;
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
  dataset: Dataset;
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
  if (publications.length > 0) {
  return <ul>
    {publications.map(link => {
    return <li key={link.url + link.name}><a href={link.url}>{link.name}</a></li>})}
    </ul>}
  else
    {return <ul><em>None</em></ul>}
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
        <strong>Acquisition date</strong>: {startDate.toDateString()}
      </p>
      <p>
        <strong>Dataset ID</strong>: {id}
      </p>
      <p>
        <strong>Voxel size ({gridSpacingUnit})</strong>
        : {gridSpacing.join(', ')}
      </p>
      <p>
        <strong>Dimensions ({gridDimensionsUnit})</strong>:{" "}
        {gridDimensions.join(', ')}
      </p>
    </Box>
  );
}

export function DatasetAcquisition({
  storageLocation,
  dataset
}: DescriptionFullProps) {
  const pubs = dataset.publications
  const acq = dataset.imageAcquisition
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
              Final voxel size ({acq.gridSpacingUnit})
            </strong>
            : {acq.gridSpacing.join(', ')} {'(' + acq.gridAxes.join(', ')+ ')'}
          </p>
          <p>
            <strong>
              Dimensions ({acq.gridDimensionsUnit})
            </strong>
            : {acq.gridDimensions.join(', ')} {'(' + acq.gridAxes.join(', ')+ ')'}
          </p>
          <p>
            <strong>Dataset ID</strong>: {dataset.name}
          </p>

            <strong>DOI</strong>:{" "}
            <PublicationList publications={pubs.filter((p) => p.type == 'doi')}/>

            <strong>Publications</strong>:{" "}
            <PublicationList publications={pubs.filter((p) => p.type == 'paper')}/>
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
        <strong>Sample</strong>: {dataset.sample.description}
      </p>
      <p>
        <strong>Protocol</strong>: {dataset.sample.protocol}
      </p>
      <p>
        <strong>Contributions</strong>: {dataset.sample.contributions}
      </p>
    </>
  );
}
