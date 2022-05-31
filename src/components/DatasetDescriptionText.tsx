import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { DatasetMetadata } from "../api/dataset_metadata";
import { DOI, Hyperlink, UnitfulVector } from "../api/manifest";
import { IFoob } from "../api/datasets2";
import {components} from "../api/schema"

type IPublication = components["schemas"]["Publication"]

export interface DescriptionPreviewProps {
  dataset: IFoob;
  titleLink: string;
}

export interface DescriptionSummaryProps {
  children: any;
  dataset: IFoob;
}

export interface DescriptionFullProps {
  s3URL: string;
  bucketBrowseLink: string;
  storageLocation: string;
  dataset: IFoob;
}

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main
    }
  })
);



interface HyperlinkListProps {
  links: Array<IPublication>
}


export function HyperlinkList({links}: HyperlinkListProps) {
  return (<ul>{links.map((link, idx) => {
    let key = "publicationList" + idx;
    let result: React.ReactFragment;
    result = <li key={key}><a href={link.url}>{link.name}</a></li>
    return result
    
})}</ul>)
} 

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
  dataset
}: DescriptionPreviewProps) {
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="h6" className={classes.title}>
        {dataset.description}
      </Typography>
      <p>
        <strong>Acquisition date</strong>: {dataset.acquisition!.start_date}
      </p>
      <p>
        <strong>Dataset ID</strong>: {dataset.name}
      </p>
      <p>
        <strong>Voxel size ({dataset.acquisition!.grid_spacing.unit})</strong>
        : {StringifyUnitfulVector(dataset.acquisition!.grid_spacing, 1)}
      </p>
      <p>
        <strong>Dimensions ({dataset.acquisition!.dimensions.unit})</strong>:{" "}
        {StringifyUnitfulVector(dataset.acquisition!.dimensions, 1)}
      </p>
    </Box>
  );
}

export function DatasetAcquisition({
  storageLocation,
  dataset
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
              Final voxel size ({dataset.acquisition!.grid_spacing.unit})
            </strong>
            : {StringifyUnitfulVector(dataset.acquisition!.grid_spacing, 1)}
          </p>
          <p>
            <strong>
              Dimensions ({dataset.acquisition!.dimensions.unit})
            </strong>
            : {StringifyUnitfulVector(dataset.acquisition!.dimensions, 0)}
          </p>
          <p>
            <strong>Imaging duration (days)</strong>:{" "}
            {dataset.acquisition!.duration_days}
          </p>
          <p>
            <strong>Imaging start date</strong>:{" "}
            {dataset.acquisition!.start_date}
          </p>
          <p>
            <strong>Primary energy (EV)</strong>:{" "}
            {dataset.acquisition!.primary_energy}
          </p>
          <p>
            <strong>Bias (V)</strong>: {dataset.acquisition!.bias_voltage}
          </p>
          <p>
            <strong>Imaging current (nA)</strong>:{" "}
            {dataset.acquisition!.current}
          </p>
        </Grid>
        <Grid item xs={6}>
          <p>
            <strong>Scanning speed (MHz)</strong>:{" "}
            {dataset.acquisition!.scan_rate}
          </p>
          <p>
            <strong>Dataset ID</strong>: {dataset.acquisition!.name}
          </p>
            <strong>DOI</strong>:{" "}
            <HyperlinkList links={dataset.publications.filter(p => p.type === 'doi')}/>
            <strong>Publications</strong>:{" "}
            <HyperlinkList links={dataset.publications.filter(p => p.type === 'paper')}/>
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
        {dataset.name}
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
