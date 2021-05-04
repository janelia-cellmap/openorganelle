import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Skeleton from '@material-ui/lab/Skeleton';
import { Paper, Grid, Divider } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { AppContext } from "../context/AppContext";
import DatasetPaper from "./DatasetPaper";

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

export default function DatasetDetails({url}: DatasetDetailsProps) {
  const classes = useStyles();
  let { slug }: {slug: string} = useParams();
  const {appState } = useContext(AppContext);
  if (appState.datasetsLoading) {
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="space-around"
          alignItems="stretch"
        >
          <Grid item xs={4}>
          <Skeleton variant="rect" height={40}/>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          </Grid>
          <Divider orientation="vertical" flexItem={true}></Divider>
          <Grid
            item
            container
            direction="column"
            xs={4}
            spacing={2}
            justify="flex-end"
          >
            <Skeleton variant="rect" height={40}/>
            <Skeleton />
            <Skeleton variant="rect" height={40}/>
            <Skeleton />
          </Grid>
          <Divider orientation="vertical" flexItem={true}></Divider>
          <Grid item xs={4}>
            <Skeleton variant="rect" width={256} height={256}/>
          </Grid>
        </Grid>
      </Paper>

    );
  } else if (appState.datasets.get(slug) === undefined) {
    return <div> Error 404: Could not find a dataset with the key {slug}</div>;
  } else {
    return <DatasetPaper datasetKey={slug} key={url} />;
  }
}
