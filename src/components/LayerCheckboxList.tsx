import {
  Checkbox,
  createStyles,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import React from "react";
import { ContentType, Dataset, Volume } from "../api/datasets";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    }
  })
);

const contentTypeProps = {
  em: { legend: "EM Layers" },
  prediction: { legend: "Prediction Layers" },
  segmentation: { legend: "Segmentation Layers" },
  analysis: { legend: "Analysis Layers" }
};

type LayerCheckBoxListProps = {
  volumes: Volume[];
  checkState: Map<string, boolean>;
  handleChange: any;
};

type LayerCheckBoxListCollectionProps = {
  dataset: Dataset;
  checkState: Map<string, boolean>;
  handleChange: any;
};

function LayerCheckboxList({
  volumes,
  checkState,
  handleChange
}: LayerCheckBoxListProps) {
  const classes = useStyles();
  const contentType = volumes[0].contentType;
  const checkBoxList = volumes?.map((volume: Volume) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkState.get(volume.name)}
            onChange={handleChange}
            color="primary"
            name={volume.name}
            size="small"
          />
        }
        label={volume.description}
        key={`${volume.name}`}
      />
    );
  });
  return (
    <React.Fragment key={contentType}>
      <FormLabel component="legend">
        {contentTypeProps[contentType].legend}
      </FormLabel>
      <Divider />
      <FormGroup className={classes.formGroup}>{checkBoxList}</FormGroup>
    </React.Fragment>
  );
}

export default function LayerCheckboxListCollection({
  dataset,
  checkState,
  handleChange
}: LayerCheckBoxListCollectionProps) {
  const classes = useStyles();
  const volumeGroups: Map<ContentType, Volume[]> = new Map();
  const checkboxGroups: Map<ContentType, JSX.Element[]> = new Map();
  // partition volumes based on volume type

  dataset.volumes.forEach((v: Volume) => {
    if (volumeGroups.get(v.contentType) === undefined) {
      volumeGroups.set(v.contentType, []);
    }
    volumeGroups.get(v.contentType).push(v);
  });

  const checkboxLists = Object.keys(contentTypeProps).map(ct => {
    let volumes: Volume[] = volumeGroups.get(ct);
    if (volumes !== undefined && volumes.length > 0) {
      return LayerCheckboxList({ volumes, checkState, handleChange });
    }
  });
  return (
    <Grid item>
      <Typography variant="h6">Select layers for this view</Typography>
      <FormControl component="fieldset" className={classes.formControl}>
        {checkboxLists}
      </FormControl>
    </Grid>
  );
}
