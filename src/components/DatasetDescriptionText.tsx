import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {DatasetDescription} from "../api/dataset_description";
import ReactHtmlParser from 'react-html-parser';

type DescriptionTextProps = {
  titleLink: string;
  datasetDescription: DatasetDescription;
};

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main,
      textDecoration: "none"
    }
  })
);


export default function DatasetDescriptionText(props: DescriptionTextProps) {
  const description = props.datasetDescription;
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="h6">
        <RouterLink to={props.titleLink} className={classes.title}>
          {ReactHtmlParser(description.Title)}
        </RouterLink>
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
