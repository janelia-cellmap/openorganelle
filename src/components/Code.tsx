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

export default function Code() {
  const classes = useStyles();
  return (
    <div style={{ maxWidth: "54em", marginLeft: "auto", marginRight: "auto" }}>
      <Typography variant="h3" gutterBottom>
        OpenOrganelle Code
      </Typography>
      <Paper className={classes.section} id="website">
        <Typography gutterBottom>
          All of the software we developed for preparing, analyzing, and
          visualizing these datasets is open source. These tools can be found on
          the <a href="https://github.com/janelia-cosem/">COSEM</a> and{" "}
          <a href="https://github.com/saalfeldlab/">Saalfeld lab</a> github
          pages.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Network training and validation
        </Typography>
        <Typography gutterBottom>
          Source code:{" "}
          <a href="https://github.com/saalfeldlab/CNNectome">
            https://github.com/saalfeldlab/CNNectome
          </a>
        </Typography>
        <Typography gutterBottom>
          Training setups for Heinrich et al., 2020:{" "}
          <a href="https://github.com/janelia-cosem/training_setups/">
            https://github.com/janelia-cosem/training_setups/
          </a>
        </Typography>

        <Typography gutterBottom>
          Train your own networks from scratch with CNNectome: a collection of
          scripts for building, training and validating Convolutional Neural
          Networks (CNNs).
        </Typography>
        <Typography variant="h4" gutterBottom>
          Network inference
        </Typography>
        <Typography gutterBottom>
          Source code:{" "}
          <a href="https://github.com/saalfeldlab/simpleference">
            https://github.com/saalfeldlab/simpleference
          </a>
        </Typography>
        <Typography gutterBottom>
          Generate predictions from trained networks with simpleference: a low
          overhead conv-net inference for large 3D volumes.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Segmentation processing and quantification
        </Typography>
        <Typography gutterBottom>
          Source code:{" "}
          <a href="https://github.com/janelia-cosem/hot-knife/tree/cosem-analysis">
            https://github.com/janelia-cosem/hot-knife/tree/cosem-analysis
          </a>
        </Typography>
        <Typography gutterBottom>
          Refinements applied for Heinrich et al., 2020:{" "}
          <a href="https://github.com/janelia-cosem/refinements">
            https://github.com/janelia-cosem/refinements
          </a>
        </Typography>

        <Typography gutterBottom>
          Post-process raw network predictions and generate quantitative metrics
          from segmentations with the code we provide.
        </Typography>
        <Typography variant="h4" gutterBottom>
          CLEM registration
        </Typography>
        <Typography gutterBottom>
          Source code:{" "}
          <a href="https://github.com/janelia-cosem/cosem-lm-em-registration/">
            https://github.com/janelia-cosem/cosem-lm-em-registration/
          </a>
        </Typography>
        <Typography gutterBottom>
          Generate your own transformations for CLEM registration or apply
          transformations using the scripts and code we provide.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Manual pairwise prediction evaluation
        </Typography>
        <Typography gutterBottom>
          Source code:{" "}
          <a href="https://github.com/janelia-cosem/Fiji_COSEM_Predictions_Evaluation">
            https://github.com/janelia-cosem/Fiji_COSEM_Predictions_Evaluation
          </a>
        </Typography>
        <Typography gutterBottom>
          Install the Fiji plugin we used to evaluate network predictions.
        </Typography>
      </Paper>
    </div>
  );
}
