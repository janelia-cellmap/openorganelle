import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { TaggedDataset } from "../context/DatasetsContext";
import { DOI, Hyperlink, UnitfulVector } from "../api/manifest";

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
  datasetMetadata: TaggedDataset;
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



interface HyperlinkListProps {
  links: Array<string | Hyperlink>
}

function isHyperlinkOrDOI(val: DOI | Hyperlink): val is Hyperlink {
  return (val as Hyperlink).href !== undefined;
} 

function doiToHyperlink(d: Hyperlink | DOI): Hyperlink{
  if (!isHyperlinkOrDOI(d)) {
    let d_ = d as DOI
    return {href: "https://doi.org/" + d_.DOI, title: d_.id}
  }
  else {
    return d as Hyperlink;
  }
}


export function HyperlinkList({links}: HyperlinkListProps) {
  return (<ul>{links.map((link, idx) => {
    let key = "publicationList" + idx;
    let result: React.ReactFragment;
    if (typeof(link) == 'string'){
      result = <li key={key}>{link}</li>
    }
    else {
      result = <li key={key}><a href={link.href}>{link.title}</a></li>
    }
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
        : {StringifyUnitfulVector(gridSpacing, 1)}
      </p>
      <p>
        <strong>Dimensions ({dimensions.unit})</strong>:{" "}
        {StringifyUnitfulVector(dimensions, 1)}
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
              Final voxel size ({datasetMetadata.acquisition!.grid_spacing.unit})
            </strong>
            : {StringifyUnitfulVector(datasetMetadata.acquisition!.grid_spacing!, 1)}
          </p>
          <p>
            <strong>
              Dimensions ({datasetMetadata.acquisition!.dimensions.unit})
            </strong>
            : {StringifyUnitfulVector(datasetMetadata.acquisition!.dimensions, 0)}
          </p>
          <p>
            <strong>Imaging duration (days)</strong>:{" "}
            {datasetMetadata.acquisition!.duration_days}
          </p>
          <p>
            <strong>Imaging start date</strong>:{" "}
            {datasetMetadata.acquisition!.start_date}
          </p>
          <p>
            <strong>Primary energy (EV)</strong>:{" "}
            {datasetMetadata.acquisition!.primary_energy}
          </p>
          <p>
            <strong>Bias (V)</strong>: {datasetMetadata.acquisition!.bias_voltage}
          </p>
          <p>
            <strong>Imaging current (nA)</strong>:{" "}
            {datasetMetadata.acquisition!.current}
          </p>
        </Grid>
        <Grid item xs={6}>
          <p>
            <strong>Scanning speed (MHz)</strong>:{" "}
            {datasetMetadata.acquisition!.scan_rate}
          </p>
          <p>
            <strong>Dataset ID</strong>: {datasetMetadata.name}
          </p>
          <p>
            <strong>DOI</strong>:{" "}
            <HyperlinkList links={datasetMetadata.publications.map(doiToHyperlink)}/>
          </p>
          <p>
            <strong>Publications</strong>:{" "}
            <HyperlinkList links={datasetMetadata.publications}/>
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
        {datasetMetadata.description}
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
