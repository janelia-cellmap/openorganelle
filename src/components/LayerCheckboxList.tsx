import {
  createStyles,
  FormControl,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState, useEffect } from "react";
import { ContentType, Dataset, Volume } from "../api/datasets";
import LayerGroup from "./LayerGroup";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    margin: {
      margin: "0.3em 0"
    },
    control: {
      width: "100%",
      height: "400px",
      overflow: "scroll"
    }
  })
);

const contentTypeProps = new Map([
  ["em", "EM Layers"],
  ["prediction", "Prediction Layers"],
  ["segmentation", "Segmentation Layers"],
  ["analysis", "Analysis Layers"]
]);

type LayerCheckBoxListCollectionProps = {
  dataset: Dataset;
  checkState: Map<string, boolean>;
  handleChange: any;
};

function LayersList({ dataset, checkState, handleChange, filter }) {
  const classes = useStyles();
  const [volumesList, setVolumes] = useState([]);

  useEffect(() => {
    // filter volumes based on filter string
    let filteredVolumes = Array.from(dataset.volumes.values());
    if (filter) {
      // TODO: make this case insensitive
      filteredVolumes = filteredVolumes.filter(v =>
        v.description.toLowerCase().includes(filter.toLowerCase()) ||
        v.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    setVolumes(filteredVolumes);
  }, [dataset, filter]);

  const volumeGroups: Map<ContentType, Volume[]> = new Map();

  volumesList.forEach((v: Volume) => {
    if (volumeGroups.get(v.contentType) === undefined) {
      volumeGroups.set(v.contentType, []);
    }
    volumeGroups.get(v.contentType).push(v);
  });

  const checkboxLists = Array.from(contentTypeProps.keys()).map((ct) => {
    let volumes: Volume[] = volumeGroups.get(ct);
    if (volumes !== undefined && volumes.length > 0) {
      return <LayerGroup key={ct} volumes={volumes} checkState={checkState} handleChange={handleChange} contentTypeProps={contentTypeProps} />;
    }
    return null;
  });

  return <div className={classes.control}>{checkboxLists}</div>;
}

function LayerFilter({ value, onChange }) {
  const classes = useStyles();
  return (
    <FormControl className={classes.margin} fullWidth variant="outlined">
      <InputLabel htmlFor="input-with-icon-adornment">
        type keywords here to filter the list
      </InputLabel>
      <OutlinedInput
        id="input-with-icon-adornment"
        labelWidth={250}
        value={value}
        onChange={onChange}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
}


export default function LayerCheckboxListCollection({
  dataset,
  checkState,
  handleChange
}: LayerCheckBoxListCollectionProps) {
  const [layerFilter, setLayerFilter] = useState("");

  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerFilter(event.target.value);
  };

  return (
    <>
      <Typography variant="h6">2. Select layers for the view</Typography>
      <LayerFilter value={layerFilter} onChange={handleLayerChange} />
      <LayersList
        filter={layerFilter}
        dataset={dataset}
        checkState={checkState}
        handleChange={handleChange}
      />
    </>
  );
}
