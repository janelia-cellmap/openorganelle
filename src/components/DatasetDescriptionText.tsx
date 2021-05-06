import React from "react";
import ReactHtmlParser from "react-html-parser";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ClipboardLink from "./ClipboardLink";
import { DatasetDescription, DescriptionSummary, DescriptionAbout, DescriptionAcquisition } from "../api/dataset_description";

type DescriptionTextProps = {
  titleLink: string;
  s3URL?: string;
  bucketBrowseLink?: string;
  datasetDescription: DatasetDescription | undefined;
  storageLocation?: string;
};

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main
    }
  })
);

export function DatasetDescriptionPreview(props: DescriptionTextProps) {
  const description = props.datasetDescription;
  const classes = useStyles();
  if (description === undefined) {
    return (
      <Box>
        <Typography variant="h6" className={classes.title}>
          {ReactHtmlParser("No description provided")}
        </Typography>
      </Box>
    );
  } else
    return (
      <Box>
        <Typography variant="h6" className={classes.title}>
          {ReactHtmlParser(description.Title)}
        </Typography>
        {[...Object.keys(description.Summary)].map(value => (
          <p key={value}>
            <strong>{ReactHtmlParser(value)}</strong>:{" "}
            {ReactHtmlParser(description.Summary[value as keyof DescriptionSummary])}
          </p>
        ))}
      </Box>
    );
}

export function DatasetDescriptionFull(props: DescriptionTextProps) {
  const description = props.datasetDescription;
  const classes = useStyles();

  if (description === undefined) {
    return (
      <Box>
        <Typography variant="h6" className={classes.title}>
          {ReactHtmlParser("No description provided")}
        </Typography>
      </Box>
    );
  } else {
    return (
      <>
        <Typography variant="h6" className={classes.title}>
          {ReactHtmlParser(description.Title)}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {[...Object.keys(description["About this sample"])].map(value => (
              <p key={value}>
                <strong>{ReactHtmlParser(value)}</strong>:{" "}
                {ReactHtmlParser(description["About this sample"][value as keyof DescriptionAbout])}
              </p>
            ))}
          </Grid>
          <Grid item xs={4}>
            {[...Object.keys(description["Acquisition information"])].map(
              value => (
                <p key={value}>
                  <strong>{ReactHtmlParser(value)}</strong>:{" "}
                  {ReactHtmlParser(
                    description["Acquisition information"][value as keyof DescriptionAcquisition]
                  )}
                </p>
              )
            )}
          </Grid>
          <Grid item xs={4}>
            {[...Object.keys(description["Dataset information"])].map(
              value => (
                <p key={value}>
                  <strong>{ReactHtmlParser(value)}</strong>:{" "}
                  {ReactHtmlParser(
                    description["Dataset information"][value as keyof DatasetDescription]
                  )}
                </p>
              )
            )}
                        <p>
              <strong>Dataset location</strong>:{props.storageLocation}
            </p>
            <ClipboardLink bucketBrowseLink={String(props.bucketBrowseLink)} s3URL={String(props.s3URL)} />
          </Grid>
        </Grid>
      </>
    );
  }
}

