import React, { useContext } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import { AppContext } from "../context/AppContext";

const useStyles = makeStyles(theme => ({
  settings: {
    margin: "1em"
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="bucket-name"
            label="AWS Bucket"
            value={appState.dataBucket}
            onChange={e =>
              setAppState({ ...appState, dataBucket: e.target.value })
            }
          />
        </Grid>
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
      </Grid>
    </div>
  );
}
