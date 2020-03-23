import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Markdown from "react-markdown/with-html"
import thumbnail from "./cosem3d.png";
import {makeDatasets} from "../api/datasets";
import { Grid, Divider } from "@material-ui/core";

const neuroglancerAddress = "http://neuroglancer-demo.appspot.com/#!";

const useStyles = makeStyles(theme => ({  
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: theme.spacing(2)
  },
  grid: {     
   direction: "row",
   alignItems: "center",
   justify:"center"
  },
  markdown : {
    escapeHtml: false,
    textAlign: "left",
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
  const [mdText, setMdText] = useState('');
  
  useEffect(() => {    
    const datasets = makeDatasets('janelia-cosem-dev');
    datasets.then(setDatasets);
    // Temporary for testing markdown rendering 
    const mdText = fetch('https://raw.githubusercontent.com/janelia-cosem/dataset_descriptions/master/HeLa_Cell2_4x4x4nm/data-portal-description.md', {cache: "reload"}).then((response) => response.text());
    mdText.then(setMdText);
    mdText.then(console.log)
                  }, []);

  // this loop will be where you modify the meta information and generate
  // the urls.
  const displayedDataSets = datasets.map(dataset => {
    return (
      <Paper key={dataset.path} className={classes.paper}>
        <Grid container className={classes.grid} spacing={10}>           
          <Grid item xs zeroMinWidth> <Markdown source={mdText} escapeHtml={false} className={classes.markdown}/> </Grid>
          <Divider orientation="vertical"/>
          <Grid item> <a href={`${neuroglancerAddress}${dataset.neuroglancerURLFragment}`} target="_blank" rel="noopener noreferrer">View with neuroglancer</a> </Grid>
        </Grid>
      </Paper>
    );
  });

  return (
    <>
      <div className={classes.masthead}>
        <Typography className={classes.title} variant="h3">
          FIB-SEM datasets
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
