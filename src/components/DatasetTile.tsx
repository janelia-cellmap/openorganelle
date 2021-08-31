import React, { useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box, Grid, CardContent, CardMedia, CardActionArea, Card } from "@material-ui/core";
import { AppContext } from "../context/AppContext";
import { Dataset } from "../api/datasets";
import {DatasetDescriptionPreview} from "./DatasetDescriptionText";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      margin: theme.spacing(2),
    },
    compact: {
      width: "256px",
      margin: "1em",
    },
    link: {
      textDecoration: "none",
      width: "100%",
    }
  })
);

interface DatasetTileProps {
  datasetKey: string;
  compact?: boolean;
}

export default function DatasetTile({ datasetKey, compact = false }: DatasetTileProps) {
  const {appState} = useContext(AppContext);
  const dataset: Dataset = appState.datasets.get(datasetKey)!;
  const datasetLink = `/datasets/${dataset.name}`;
  const classes = useStyles();

  if (compact) {
    return (
        // remove variant and add raised prop for more dramatic outline
        <Card variant="outlined" className={classes.compact}>
          <CardActionArea component={RouterLink} to={datasetLink}>
            <CardMedia
              style={{ height: 256 }}
              image={dataset.thumbnailURL}
            />
            <CardContent style={{ whiteSpace: "nowrap"}}>
              <Box component="p" textOverflow="ellipsis" overflow="hidden">{dataset.description.title}</Box>
            </CardContent>
          </CardActionArea>
        </Card>
    );
  }

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
              datasetMetadata={dataset.description}
              titleLink={datasetLink}
            />
          </Grid>
          <Grid item xs={4}>
            <CardActionArea>
              <CardMedia
                style={{ height: 256, width: 256, borderRadius: "10%" }}
                image={dataset.thumbnailURL}
              />
            </CardActionArea>
          </Grid>
        </Grid>
      </Paper>
    </RouterLink>
  );
}
