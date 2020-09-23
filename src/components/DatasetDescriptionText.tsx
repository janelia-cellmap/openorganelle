import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Box } from "@material-ui/core";
import {DatasetDescription} from "../api/dataset_description";
import ReactHtmlParser from 'react-html-parser';

type DescriptionTextProps = {
  titleLink: string;
  datasetDescription: DatasetDescription;
};

export default function DatasetDescriptionText(props: DescriptionTextProps) {
  const description = props.datasetDescription;

  return (
    <Box>
      <h3>
        <RouterLink to={props.titleLink}>
          {ReactHtmlParser(description.Title)}
        </RouterLink>
      </h3>
      {[...Object.keys(description.Summary)].map(value => (
        <p key={value}>
          <strong>{ReactHtmlParser(value)}</strong>:{" "}
          {ReactHtmlParser(description.Summary[value])}
        </p>
      ))}
    </Box>
  );
}
