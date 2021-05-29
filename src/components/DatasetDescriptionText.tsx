import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ClipboardLink from "./ClipboardLink";
import { DatasetMetadata, ImagingMetadata, DOIMetadata, SampleMetadata } from "../api/dataset_metadata";

export interface DescriptionPreviewProps {
  datasetMetadata: DatasetMetadata
  titleLink: string;
}

export interface DescriptionFullProps {
  s3URL: string;
  bucketBrowseLink: string;
  storageLocation: string;
  datasetMetadata: DatasetMetadata;
}


interface DescriptionTextProps {
  titleLink: string;
  s3URL?: string;
  bucketBrowseLink?: string;
  DatasetMetadata: DatasetMetadata;
  storageLocation?: string;
}

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main
    }
  })
);

export function DatasetDescriptionPreview({datasetMetadata, titleLink}: DescriptionPreviewProps) {
  const classes = useStyles();
  const dimensions_string = [...datasetMetadata.imaging.dimensions.values.entries()]
  return (
      <Box>
        <Typography variant="h6" className={classes.title}>
          {datasetMetadata.title}
        </Typography>
        <p><strong>Acquisition date</strong>:{" "}{datasetMetadata.imaging.startDate}</p>
        <p><strong>Dataset ID</strong>:{" "}{datasetMetadata.id}</p>
        <p><strong>Voxel size ({datasetMetadata.imaging.gridSpacing.unit})</strong>:{" "}{datasetMetadata.imaging.gridSpacing.string_repr()}</p>
        <p><strong>Dimensions ({datasetMetadata.imaging.dimensions.unit})</strong>:{" "}{datasetMetadata.imaging.dimensions.string_repr()}</p>
      </Box>
    );
}

export function DatasetDescriptionFull({s3URL, bucketBrowseLink, storageLocation, datasetMetadata}: DescriptionFullProps ) {
  const classes = useStyles();
  const EMDOI = datasetMetadata.DOI.filter(v => v.id === 'em');
  const SegDOI = datasetMetadata.DOI.filter(v => v.id === 'seg');
    return (
      <>
        <Typography variant="h6" className={classes.title}>
          {datasetMetadata.title}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
          <p><strong>{'Sample'}</strong>:{" "}{datasetMetadata.sample.description}</p>
          <p><strong>{'Protocol'}</strong>:{" "}{datasetMetadata.sample.protocol}</p>
          <p><strong>{'Contributions'}</strong>:{" "}{datasetMetadata.sample.contributions}</p>
          </Grid>
          <Grid item xs={4}>
          <p><strong>Final voxel size ({datasetMetadata.imaging.gridSpacing.unit})</strong>:{" "}{datasetMetadata.imaging.gridSpacing.string_repr()}</p>
          <p><strong>Dimensions ({datasetMetadata.imaging.dimensions.unit})</strong>:{" "}{datasetMetadata.imaging.dimensions.string_repr()}</p>
          <p><strong>Imaging duration (days)</strong>:{" "}{datasetMetadata.imaging.duration}</p>
          <p><strong>Imaging start date</strong>:{" "}{datasetMetadata.imaging.startDate}</p>
          <p><strong>Primary energy (EV)</strong>:{" "}{datasetMetadata.imaging.primaryEnergy}</p>
          <p><strong>Bias (V)</strong>:{" "}{datasetMetadata.imaging.biasVoltage}</p>
          <p><strong>Imaging current (nA)</strong>:{" "}{datasetMetadata.imaging.current}</p>
          <p><strong>Scanning speed (MHz)</strong>:{" "}{datasetMetadata.imaging.scanRate}</p>
          </Grid>
          <Grid item xs={4}>
          <p><strong>EM DOI</strong>:{" "}{EMDOI.length > 0 ? EMDOI[0].DOI : 'N/A'}</p>
          <p><strong>Segmentations DOI</strong>:{" "}{SegDOI.length > 0 ? SegDOI[0].DOI : 'N/A'}</p>
          <p><strong>Dataset ID</strong>:{" "}{datasetMetadata.id}</p>
          <p><strong>Publications</strong>:{" "}{datasetMetadata.publications.join('; ')}</p>
          <p><strong>Dataset location</strong>:{" "}{storageLocation}</p>
            <ClipboardLink bucketBrowseLink={String(bucketBrowseLink)} s3URL={String(s3URL)} />
          </Grid>
        </Grid>
      </>
    );
}

