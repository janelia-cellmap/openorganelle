import React, { useContext } from "react";
import {Grid, TextField, Typography} from "@mui/material";
import { makeStyles } from "@mui/material/styles";
import { AppContext } from "../context/AppContext";

const useStyles = makeStyles(() => ({
  settings: {
    margin: "1em"
  },
  metadataSource: {
    minWidth: "55em"
  },
  nglink: {
    minWidth: "25em"
  },
  version: {
    float: "right"
  }
}));

export default function Settings() {
  const classes = useStyles();
  const {appState, setAppState} = useContext(AppContext);

  return (
    <div className="content">
      <span className={classes.version}>v{process.env.REACT_APP_VERSION}</span>
      <Typography variant="h3" gutterBottom>
        Site settings
      </Typography>
      <Grid container 
            spacing={3}>
        <Grid item xs={12}>
          <TextField
            className={classes.nglink}
            id="ngLink"
            label="Neuroglancer address"
            value={appState.neuroglancerAddress}
            onChange={e =>
              setAppState({ ...appState, neuroglancerAddress: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.metadataSource}
            id="metadataSource"
            label="Metadata Source"
            value={appState.metadataEndpoint}
            onChange={e =>
              setAppState({ ...appState, metadataEndpoint: e.target.value })
            }
          />
        </Grid>
      </Grid>
    </div>
  );
}
