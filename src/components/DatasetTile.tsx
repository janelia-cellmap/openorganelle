import React from "react";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  CardContent,
  CardMedia,
  CardActionArea,
  Card,
  Chip
} from "@material-ui/core";
import Popper from "@material-ui/core/Popper";

import { Dataset } from "../api/datasets";
import { DatasetDescriptionPreview } from "./DatasetDescriptionText";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      margin: theme.spacing(2)
    },
    compact: {
      width: "256px",
      margin: "1em"
    },
    link: {
      textDecoration: "none",
      width: "100%"
    },
    popper: {
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper
    }
  })
);

interface DatasetTileProps {
  dataset: [string, Dataset];
  compact?: boolean;
}

export default function DatasetTile({
  dataset,
  compact = false
}: DatasetTileProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [elevation, setElevation] = React.useState<number>(1);
  const [,datasetMeta] = dataset;
  const datasetLink = `/datasets/${datasetMeta.name}`;
  const classes = useStyles();

  const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    setElevation(10);
    setAnchorEl(event.currentTarget);
  };
  const handleMouseOut = () => {
    setElevation(1);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (compact) {
    return (
      // remove variant and add raised prop for more dramatic outline
      <>
        <Card
          // variant="outlined"
          raised
          elevation={elevation}
          className={classes.compact}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <CardActionArea component={RouterLink} to={datasetLink}>
            <CardMedia style={{ height: 256 }} image={datasetMeta.thumbnailURL} />
            <CardContent style={{ whiteSpace: "nowrap", padding: "0 1em" }}>
              <Box component="p" textOverflow="ellipsis" overflow="hidden">
                {datasetMeta.description.title}
              </Box>
              <Chip label="FIB-SEM"/>
              <Chip label="Segmentations"/>
            </CardContent>
          </CardActionArea>
        </Card>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="top"
          modifiers={{
            flip: {
              enabled: true
            },
            offset: {
              enabled: true,
              offset: "0,10"
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "scrollParent"
            }
          }}
        >
          <div className={classes.popper}>
            <DatasetDescriptionPreview
              datasetMetadata={datasetMeta.description}
              titleLink={datasetLink}
            />
          </div>
        </Popper>
      </>
    );
  }
else
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
              datasetMetadata={datasetMeta.description}
              titleLink={datasetLink}
            />
          </Grid>
          <Grid item xs={4}>
            <CardActionArea>
              <CardMedia
                style={{ height: 256, width: 256, borderRadius: "10%" }}
                image={datasetMeta.thumbnailURL}
              />
            </CardActionArea>
          </Grid>
        </Grid>
      </Paper>
    </RouterLink>
  );
}
