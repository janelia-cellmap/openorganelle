import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Publication, TaggedDataset, UnitfulVector } from "../api/datasets";
import {stringifyUnitfulVector } from "../api/util";

export interface DescriptionPreviewProps {
  title: string;
  startDate: string;
  id: string;
  gridSpacing: UnitfulVector;
  dimensions: UnitfulVector;
  titleLink: string;
}

export interface DescriptionSummaryProps {
  children: any;
  dataset: TaggedDataset;
}

export interface DescriptionFullProps {
  s3URL: string;
  bucketBrowseLink: string;
  storageLocation: string;
  datasetMetadata: TaggedDataset;
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
  title, startDate, id, gridSpacing, dimensions}: DescriptionPreviewProps) {
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
        <strong>Voxel size ({gridSpacing.unit})</strong>
        : {stringifyUnitfulVector(gridSpacing, 1)}
      </p>
      <p>
        <strong>Dimensions ({dimensions.unit})</strong>:{" "}
        {stringifyUnitfulVector(dimensions, 1)}
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
              Final voxel size ({datasetMetadata.acquisition!.gridSpacing.unit})
            </strong>
            : {stringifyUnitfulVector(datasetMetadata.acquisition!.gridSpacing!, 1)}
          </p>
          <p>
            <strong>
              Dimensions ({datasetMetadata.acquisition!.dimensions.unit})
            </strong>
            : {stringifyUnitfulVector(datasetMetadata.acquisition!.dimensions, 0)}
          </p>
          <p>
            <strong>Imaging duration (days)</strong>:{" "}
            {datasetMetadata.acquisition!.durationDays}
          </p>
          <p>
            <strong>Imaging start date</strong>:{" "}
            {datasetMetadata.acquisition!.startDate}
          </p>
          <p>
            <strong>Primary energy (EV)</strong>:{" "}
            {datasetMetadata.acquisition!.primaryEnergy}
          </p>
          <p>
            <strong>Bias (V)</strong>: {datasetMetadata.acquisition!.biasVoltage}
          </p>
          <p>
            <strong>Imaging current (nA)</strong>:{" "}
            {datasetMetadata.acquisition!.current}
          </p>
        </Grid>
        <Grid item xs={6}>
          <p>
            <strong>Scanning speed (MHz)</strong>:{" "}
            {datasetMetadata.acquisition!.scanRate}
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
