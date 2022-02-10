import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { DatasetMetadata } from "../api/dataset_metadata";
import { UnitfulVector } from "../api/manifest";

export interface DescriptionPreviewProps {
  datasetMetadata: DatasetMetadata;
  titleLink: string;
}

export interface DescriptionSummaryProps {
  children: any;
  datasetMetadata: DatasetMetadata;
}

export interface DescriptionFullProps {
  s3URL: string;
  bucketBrowseLink: string;
  storageLocation: string;
  datasetMetadata: DatasetMetadata;
}

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main
    }
  })
);

function StringifyUnitfulVector(vec: UnitfulVector, decimals: number): string {
  const val_array = [...Object.values(vec.values)].map(v =>
    v.toFixed(decimals)
  );
  const axis_array = [...Object.keys(vec.values)];
  if (val_array.length === 0) {
    return "N/A";
  } else {
    return `${val_array.join(" x ")} (${axis_array.join(", ")})`;
  }
}

export function DatasetDescriptionPreview({
  datasetMetadata
}: DescriptionPreviewProps) {
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="h6" className={classes.title}>
        {datasetMetadata.title}
      </Typography>
      <p>
        <strong>Acquisition date</strong>: {datasetMetadata.imaging.startDate}
      </p>
      <p>
        <strong>Dataset ID</strong>: {datasetMetadata.id}
      </p>
      <p>
        <strong>Voxel size ({datasetMetadata.imaging.gridSpacing.unit})</strong>
        : {StringifyUnitfulVector(datasetMetadata.imaging.gridSpacing, 1)}
      </p>
      <p>
        <strong>Dimensions ({datasetMetadata.imaging.dimensions.unit})</strong>:{" "}
        {StringifyUnitfulVector(datasetMetadata.imaging.dimensions, 1)}
      </p>
    </Box>
  );
}

export function DatasetAcquisition({
  storageLocation,
  datasetMetadata
}: DescriptionFullProps) {
  const classes = useStyles();
  const EMDOI = datasetMetadata.DOI.filter(v => v.id === "em");
  const SegDOI = datasetMetadata.DOI.filter(v => v.id === "seg");
  return (
    <>
      <Typography variant="h6" className={classes.title}>
        Acquisition details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <p>
            <strong>
              Final voxel size ({datasetMetadata.imaging.gridSpacing.unit})
            </strong>
            : {StringifyUnitfulVector(datasetMetadata.imaging.gridSpacing, 1)}
          </p>
          <p>
            <strong>
              Dimensions ({datasetMetadata.imaging.dimensions.unit})
            </strong>
            : {StringifyUnitfulVector(datasetMetadata.imaging.dimensions, 0)}
          </p>
          <p>
            <strong>Imaging duration (days)</strong>:{" "}
            {datasetMetadata.imaging.duration}
          </p>
          <p>
            <strong>Imaging start date</strong>:{" "}
            {datasetMetadata.imaging.startDate}
          </p>
          <p>
            <strong>Primary energy (EV)</strong>:{" "}
            {datasetMetadata.imaging.primaryEnergy}
          </p>
          <p>
            <strong>Bias (V)</strong>: {datasetMetadata.imaging.biasVoltage}
          </p>
          <p>
            <strong>Imaging current (nA)</strong>:{" "}
            {datasetMetadata.imaging.current}
          </p>
        </Grid>
        <Grid item xs={6}>
          <p>
            <strong>Scanning speed (MHz)</strong>:{" "}
            {datasetMetadata.imaging.scanRate}
          </p>
          <p>
            <strong>EM DOI</strong>: {EMDOI.length > 0 ? EMDOI[0].DOI : "N/A"}
          </p>
          <p>
            <strong>Segmentations DOI</strong>:{" "}
            {SegDOI.length > 0 ? SegDOI[0].DOI : "N/A"}
          </p>
          <p>
            <strong>Dataset ID</strong>: {datasetMetadata.id}
          </p>
          <p>
            <strong>Publications</strong>:{" "}
            {datasetMetadata.publications.join("; ")}
          </p>
          <p>
            <strong>Dataset location</strong>: {storageLocation}
          </p>
        </Grid>
      </Grid>
    </>
  );
}

export function DatasetDescriptionSummary({
  datasetMetadata,
  children
}: DescriptionSummaryProps) {
  const classes = useStyles();
  return (
    <>
      {children}
      <Typography variant="h6" className={classes.title}>
        {datasetMetadata.title}
      </Typography>
      <p>
        <strong>Sample</strong>: {datasetMetadata.sample.description}
      </p>
      <p>
        <strong>Protocol</strong>: {datasetMetadata.sample.protocol}
      </p>
      <p>
        <strong>Contributions</strong>: {datasetMetadata.sample.contributions}
      </p>
    </>
  );
}
