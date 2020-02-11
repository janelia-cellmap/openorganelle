import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: theme.spacing(2)
  }
}));

export default function Home() {
  const classes = useStyles();
  const [dataSets, setDataSets] = useState([]);

  useEffect(() => {
    const dataSets = [1, 2, 3, 4, 5];
    // this is where the code that fetches the dataset should go.
    // once fetched the information should be stored in the state with the
    // following function
    setDataSets(dataSets);
  }, []);

  // this loop will be where you modify the meta information and generate
  // the urls.
  const displayedDataSets = dataSets.map(dataset => {
    // do your url generation here.
    return (
      <Paper key={dataset} className={classes.paper}>
          DataSet <a href="">{dataset}</a>
      </Paper>
    );
  });

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Home page
      </Typography>
      <Container maxWidth="md">{displayedDataSets}</Container>
    </div>
  );
}
