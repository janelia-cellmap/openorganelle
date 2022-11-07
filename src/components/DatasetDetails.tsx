import React from "react";
import { useParams } from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import { Paper, Grid } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import DatasetPaper from "./DatasetPaper";
import { fetchDatasets } from "../api/datasets";
import { useQuery } from "react-query";


const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      margin: theme.spacing(2)
    }
  })
);

interface DatasetDetailsProps {
  url: string;
}

export default function DatasetDetails({ url }: DatasetDetailsProps) {
  const classes = useStyles();
  const { slug }: { slug: string } = useParams();
  const { isLoading, data, error } = useQuery('datasets', async () => fetchDatasets());
    if (error) {return <>There was an error fetching dataset metadata.</>}

  if (isLoading) {
    return (
      <Grid container>
        <Grid item md={8}>
          <Paper className={classes.paper} variant="outlined">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton variant="rect" height={40} />
          </Paper>
        </Grid>
        <Grid item md={4}>
          <Paper className={classes.paper} variant="outlined">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Paper>
        </Grid>
        <Grid item sm={12}>
          <Paper className={classes.paper} variant="outlined">
            <Grid container spacing={2}>
              <Grid item sm={10}>
                <Skeleton />
              </Grid>
              <Grid item sm={2}>
                <Skeleton />
              </Grid>
              <Grid item sm={6}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Grid>
              <Grid item sm={6}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item sm={12}>
          <Paper className={classes.paper} variant="outlined">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Paper>
        </Grid>
      </Grid>
    );
  } else if (data!.get(slug) === undefined) {
    return <div> Error 404: Could not find a dataset with the key {slug}</div>;
  } else {
    return <DatasetPaper datasetKey={slug} key={url} />;
  }
}
