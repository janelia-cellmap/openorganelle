import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import thumbnail from "./cosem3d.png";
import {makeDatasets} from "../api/datasets";

const neuroglancerAddress = "http://neuroglancer-demo.appspot.com/#!";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: theme.spacing(2)
  },
  masthead: {
    background: [
      "linear-gradient(90deg, rgba(51,51,51,1) 0%, rgba(119,119,119,1) 95%, rgba(51,51,51,1) 100%)",
      "rgb(51,51,51)"
    ],
    height: "100px"
  },
  thumbnail: {
    float: "right"
  },
  title: {
    float: "left",
    marginTop: "20px",
    marginLeft: "1em",
    color: "#fff"
  }
}));

export default function Home() {
  const classes = useStyles();
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {    
    /*
    const dataSets = Promise.resolve([1, 2, 3]);
    dataSets.then(setDataSets);
    */
    let datasets = makeDatasets('janelia-cosem-dev');
    datasets.then(setDatasets);
  }, []);

  // this loop will be where you modify the meta information and generate
  // the urls.
  const displayedDataSets = datasets.map(dataset => {
    // do your url generation here.
    return (
      <Paper key={dataset.path} className={classes.paper}>
  <b>{dataset.name}</b> <a href={`${neuroglancerAddress}${dataset.neuroglancerURLFragment}`} target="_blank" rel="noopener noreferrer">View with neuroglancer</a>
      </Paper>
    );
  });

  return (
    <>
      <div className={classes.masthead}>
        <Typography className={classes.title} variant="h3">
          COSEM - datasets
        </Typography>
        <img
          className={classes.thumbnail}
          src={thumbnail}
          alt="3D cosem image render"
        />
      </div>
      <div className="content">
        <Container maxWidth="md">{displayedDataSets}</Container>
      </div>
    </>
  );
}
