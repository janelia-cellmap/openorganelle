import React, { useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Grid, CardMedia, CardActionArea } from "@material-ui/core";
import { AppContext } from "../context/AppContext";
import { Dataset } from "../api/datasets";
import {DatasetDescriptionPreview} from "./DatasetDescriptionText";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      margin: theme.spacing(2)
    },
    link: {
      textDecoration: "none",
    }
  })
);

interface DatasetTileProps {
  datasetKey: string;
}

export default function DatasetTile({ datasetKey }: DatasetTileProps) {
  const {appState} = useContext(AppContext);
  const dataset: Dataset = appState.datasets.get(datasetKey)!;
  const datasetLink = `/datasets/${dataset.key}`;
  const classes = useStyles();
  return (
    <RouterLink to={datasetLink} className={classes.link}>
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="space-around"
          alignItems="stretch"
        >
          <Grid item xs={4}>
            <DatasetDescriptionPreview
              datasetDescription={dataset.description}
              titleLink={datasetLink}
            />
          </Grid>
          <Grid item xs={4}>
            <CardActionArea>
              <CardMedia
                style={{ height: 256, width: 256, borderRadius: "10%" }}
                image={dataset.thumbnailPath}
              />
            </CardActionArea>
          </Grid>
        </Grid>
      </Paper>
    </RouterLink>
  );
}
