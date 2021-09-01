import React, { useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  CardContent,
  CardMedia,
  CardActionArea,
  Card
} from "@material-ui/core";
import Popper from "@material-ui/core/Popper";

import { AppContext } from "../context/AppContext";
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
  datasetKey: string;
  compact?: boolean;
}

export default function DatasetTile({
  datasetKey,
  compact = false
}: DatasetTileProps) {
  const { appState } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dataset: Dataset = appState.datasets.get(datasetKey)!;
  const datasetLink = `/datasets/${dataset.name}`;
  const classes = useStyles();

  const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMouseOut = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (compact) {
    return (
      // remove variant and add raised prop for more dramatic outline
      <>
        <Card
          variant="outlined"
          className={classes.compact}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <CardActionArea component={RouterLink} to={datasetLink}>
            <CardMedia style={{ height: 256 }} image={dataset.thumbnailURL} />
            <CardContent style={{ whiteSpace: "nowrap", padding: "0 1em" }}>
              <Box component="p" textOverflow="ellipsis" overflow="hidden">
                {dataset.description.title}
              </Box>
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
              datasetMetadata={dataset.description}
              titleLink={datasetLink}
            />
          </div>
        </Popper>
      </>
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
