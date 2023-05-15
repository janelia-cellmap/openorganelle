import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Publication, Dataset, FibsemParams } from "../types/database";
import { z } from "zod";
import { Camelized } from "../types/camel";

const zFibsemMetadata = z.object({
  durationDays: z.number(),
  biasV: z.number(),
  scanHz: z.number(),
  currentNA: z.number(),
  landingEnergyEV: z.number()
}) satisfies z.ZodType<Camelized<FibsemParams>>


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
  const classes = useStyles();
  const pubs = dataset.publications
  const acq = dataset.imageAcquisition
  const pubPapers = pubs.filter((p) => p.type == 'paper')
  const pubDOI = pubs.filter((p) => p.type == 'doi')
  // check for an em dataset with fibsem acquisition metadata 
  let imageParams = undefined
  
  // This is a hack until we have proper rendering of image-specific metadata
  for (const im of dataset.images){
    if (zFibsemMetadata.safeParse(im.source).success)
    {
      const params = zFibsemMetadata.parse(im.source)
      imageParams = 
      <>
      <Typography variant="h6" className={classes.title}>
        FIB-SEM parameters
      </Typography>
      <p><strong>Imaging duration (days)</strong> : {params.durationDays}</p>
      <p><strong>Bias (Volts)</strong>: {params.biasV}</p>
      <p><strong>Scan rate (Hz)</strong>: {params.scanHz}</p>
      <p><strong>Current (nA)</strong>: {params.currentNA}</p>
      <p><strong>Primary energy (eV)</strong>: {params.landingEnergyEV}</p>
      </>
  }}

  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={6}>
      <Typography variant="h6" className={classes.title}>
        Acquisition details
      </Typography>
          <p>
          <strong>
              Imaging start date
            </strong>
            :  {acq.startDate.toDateString()}
            </p>
            <p>
            <strong>
              Final voxel size ({acq.gridSpacingUnit})
            </strong>
            : ({acq.gridSpacing.join(', ')}) ({acq.gridAxes.join(', ')})
          </p>
          <p>
            <strong>
              Dimensions ({acq.gridDimensionsUnit})
            </strong>
            : ({acq.gridDimensions.join(', ')}) ({acq.gridAxes.join(', ')})
          </p>
          <p>
            <strong>
              Dataset ID
            </strong>: {dataset.name}
          </p>
          <strong>
            DOI
          </strong>:{" "}
          <PublicationList publications={pubDOI}/>
          <strong>
            Publications
          </strong>:{" "}
            <PublicationList publications={pubPapers}/>
          <p>
            <strong>Dataset location</strong>: {storageLocation}
          </p>
        </Grid>
        <Grid item>
        {imageParams}
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
