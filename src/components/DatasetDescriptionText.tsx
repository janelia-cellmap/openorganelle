import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {DatasetDescription} from "../api/dataset_description";
import ReactHtmlParser from 'react-html-parser';

type DescriptionTextProps = {
  titleLink: string;
  datasetDescription: DatasetDescription | undefined;
};

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main,
    }
  })
);


export function DatasetDescriptionPreview(props: DescriptionTextProps) {
  const description = props.datasetDescription;
  const classes = useStyles();
  if (description === undefined) {
    return (
      <Box>
<Typography variant="h6" className={classes.title}>
  {ReactHtmlParser('No description provided')}
</Typography>
</Box>
    );  
  }
  else 
  return (
    <Box>
      <Typography variant="h6" className={classes.title}>
        {ReactHtmlParser(description.Title)}
      </Typography>
      {[...Object.keys(description.Summary)].map(value => (
        <p key={value}>
          <strong>{ReactHtmlParser(value)}</strong>:{" "}
          {ReactHtmlParser(description.Summary[value])}
        </p>
      ))}
    </Box>
  );
}

export function DatasetDescriptionFull(props: DescriptionTextProps) {
  const description = props.datasetDescription;
  const classes = useStyles();

  if (description === undefined)
  {
  return (
    <Box>
      <Typography variant="h6" className={classes.title}>
        {ReactHtmlParser(description.Title)}
      </Typography>

    {[...Object.keys(description["About this sample"])].map(value => (
        <p key={value}>
          <strong>{ReactHtmlParser(value)}</strong>:{" "}{ReactHtmlParser(description["About this sample"][value])}
        </p>
      ))}


{[...Object.keys(description["Acquisition information"])].map(value => (
        <p key={value}>
          <strong>{ReactHtmlParser(value)}</strong>:{" "}{ReactHtmlParser(description["Acquisition information"][value])}
        </p>
      ))}
    </Box>
  );
}

else {
  return <Box>
  <Typography variant="h6" className={classes.title}>
    {ReactHtmlParser('No description provided')}
  </Typography>
  </Box>
}
}