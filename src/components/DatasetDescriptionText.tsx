import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Publication, Dataset, FibsemParams } from "../types/database";
import { z } from "zod";
import { Camelized } from "../types/camel";

const zFibsemMetadata = z.object({
  durationDays: z.number().nullable(),
  biasV: z.number().nullable(),
  scanHz: z.number().nullable(),
  currentNA: z.number().nullable(),
  landingEnergyEV: z.number().nullable()
}) satisfies z.ZodType<Camelized<FibsemParams>>


export interface DescriptionPreviewProps {
  title: string;
  startDate: string | null;
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
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
      margin: theme.spacing(1)
    },

  })
);

interface PublicationListProps {
  publications: Publication[]
  doi: boolean
}

export function PublicationList({ publications, doi }: PublicationListProps) {
  // render DOI differently, as per the official recommendations
  // https://help.figshare.com/article/how-to-share-cite-or-embed-your-items

  if (publications.length > 0) {
    if (doi) {
      return <ul>
        {publications.map(link => {
          return <li key={link.url + "/" + link.name}>
            <p>
              <span>{link.name}</span><br />
              <span><a href={link.url}>{link.url}</a></span>
            </p>
          </li>
        }
        )}
      </ul>
    }
    else {
      return <ul>
        {publications.map(link => {
          return <li key={link.url + "/" + link.name}>
            <p>
              <span>{link.name}</span><br />
              <span><a href={link.url}>{link.url}</a></span>
            </p>
          </li>
        }
        )}
      </ul>
    }
  }
  { return <ul><em>None</em></ul> }
}

export function DatasetDescriptionPreview({
  title, startDate, id, gridSpacing, gridDimensions, gridSpacingUnit, gridDimensionsUnit }: DescriptionPreviewProps) {
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="h6" className={classes.title}>{title}</Typography>
      <p><strong>Acquisition date</strong>: {startDate ? new Date(startDate).toDateString() : ' Unknown'}</p>
      <p><strong>Dataset ID</strong>: {id}</p>
      <p><strong>Voxel size ({gridSpacingUnit})</strong>: {" "}{gridSpacing.join(', ')}</p>
      <p><strong>Dimensions ({gridDimensionsUnit})</strong>:{" "}{gridDimensions.join(', ')}</p>
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
  for (const im of dataset.images) {
    if (zFibsemMetadata.safeParse(im.source).success) {
      const params = zFibsemMetadata.parse(im.source)
      imageParams = <>
        <Typography variant="h6" className={classes.title}>
          FIB-SEM parameters
        </Typography>
        <p><strong>Imaging duration (days)</strong> : {params.durationDays ? params.durationDays : "Unknown"}</p>
        <p><strong>Bias (Volts)</strong>: {params.biasV ? params.biasV : "Unknown"}</p>
        <p><strong>Scan rate (MHz)</strong>: {params.scanHz ? params.scanHz : "Unknown"}</p>
        <p><strong>Current (nA)</strong>: {params.currentNA ? params.currentNA : "Unknown"}</p>
        <p><strong>Primary energy (eV)</strong>: {params.landingEnergyEV ? params.landingEnergyEV : "Unknown"}</p>
      </>
    }
  }

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
            </strong>: {(acq.startDate ? new Date(acq.startDate).toDateString() : 'Unknown')}
          </p>
          <p>
            <strong>Final voxel size ({acq.gridSpacingUnit})</strong>
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
          <PublicationList publications={pubDOI} doi={true} />
          <strong>
            Publications
          </strong>:{" "}
          <PublicationList publications={pubPapers} doi={false} />
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

const datasetsToBeAcknowledged = [
  "jrc_mus-guard-hair-follicle",
  "jrc_mus-meissner-corpuscle-1",
  "jrc_mus-meissner-corpuscle-2",
  "jrc_mus-pacinian-corpuscle",
];

export function DatasetAcknowledgments({dataset} : { dataset: Dataset }) {
  const classes = useStyles();
  if (datasetsToBeAcknowledged.includes(dataset.name)) {
    return (
      <Grid item sm={12}>
        <Paper className={classes.paper} variant="outlined">
          <Typography variant="h6" className={classes.title}>
            Acknowledgments
          </Typography>
          <ol>
            <li> “Research reported in this publication was supported by the National Institute Of Neurological Disorders And Stroke of the National Institutes of Health under Award Number R35NS097344. The content is solely the responsibility of the authors and does not necessarily represent the official views of the National Institutes of Health.”</li>
            <li> “Research reported in this publication was supported by the National Center For Complementary & Integrative Health of the National Institutes of Health under Award Number R01AT011447. The content is solely the responsibility of the authors and does not necessarily represent the official views of the National Institutes of Health.”</li>
          </ol>
        </Paper>
      </Grid>
    )
  }
  return null;
}
