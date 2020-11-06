import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      padding: "1em",
      marginTop: "1em"
    }
  })
);

export default function Publications() {
  const classes = useStyles();
  return (
    <div style={{ maxWidth: "54em", marginLeft: "auto", marginRight: "auto" }}>
      <Typography variant="h3" gutterBottom>
        OpenOrganelle Publications
      </Typography>
    <Paper className={classes.section}>
      <p>
        <i>Xu, C. S. et al. </i>
        <b>
          Isotropic 3D electron microscopy reference library of whole cells and
          tissues.
        </b>
        <br />
        Manuscript in preparation (2020).
      </p>
      <p>
        <i>Heinrich L, et al. </i>
        <b>Cell organelle segmentation in electron microscopy.</b>
        <br />
        Manuscript in preparation (2020)
      </p>
    </Paper>
    </div>
  );
}
