import { Box, createStyles, Link, makeStyles } from "@material-ui/core";
import React, {useContext } from "react";
import { Dataset, DatasetView, Volume } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
    })
);

type NeuroglancerLinkProps = {
    dataset: Dataset;
    view: DatasetView
    checkState: Map<string, boolean>;
  };


export default function NeuroglancerLink({dataset, view, checkState}: NeuroglancerLinkProps){
    const classes = useStyles();
    const [appState,] = useContext(AppContext);
    const neuroglancerAddress = appState.neuroglancerAddress;
    const webGL2Enabled = appState.webGL2Enabled;
    const key = `${dataset.key}_NeuroglancerLink`;
    
    const local_view = {...view};
    local_view.volumeKeys = [];
    dataset.volumes.forEach((value: Volume, key: string) => {
      if (checkState.get(key)) { local_view.volumeKeys.push(key) }
    });
    
  
    if (local_view.volumeKeys.length === 0) { return <div> No layers selected </div> }
    else {
      return (
        <Box key={key}>
          <Link
            className={classes.hyperlink}
            href={`${neuroglancerAddress
              }${dataset.makeNeuroglancerViewerState(local_view)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View with Neuroglancer
        </Link>
          <LaunchIcon fontSize="small" />
          {!webGL2Enabled && <WarningIcon />}
        </Box>
      );
    }
  };