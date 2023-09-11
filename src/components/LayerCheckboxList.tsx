import {
  createStyles,
  FormControl,
  makeStyles,
  Typography
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState, useEffect } from "react";
import {ContentType, Dataset, Imagery } from "../types/database";
import ImageCheckboxCollection from "./LayerGroup";
import { contentTypeDescriptions } from "../api/datasets";

const useStyles: any = makeStyles(() =>
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

interface LayerCheckboxListProps {
  dataset: Dataset;
  checkState: Set<string>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string | undefined;
}

interface FilteredLayerListProps {
  dataset: Dataset;
  checkState: Set<string>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string | undefined;
}

interface LayerFilterProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function FilteredLayersList({ dataset, checkState, handleImageChange, filter}: FilteredLayerListProps) {
  const classes = useStyles();
  const imageryInit: Imagery[] = []
  const [imagery, setImagery] = useState(imageryInit);
  const imageGroups: Map<ContentType, Imagery[]> = new Map();

  useEffect(() => {
    // filter images based on filter string
    let filteredVolumes = Array.from(dataset.imagery.values());
    if (filter) {
      // TODO: make this case insensitive
      filteredVolumes = filteredVolumes.filter(v =>
        v.description.toLowerCase().includes(filter.toLowerCase()) ||
        v.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    setImagery(
      filteredVolumes);
  }, [dataset, filter]);

  imagery.forEach((v: Imagery) => {
    if (imageGroups.get(v.contentType) === undefined) {
      imageGroups.set(v.contentType, []);
    }
    imageGroups.get(v.contentType)!.push(v);
  });

  const checkboxLists = Array.from(contentTypeDescriptions.keys()).map((ct) => {
    const imagery = (imageGroups.get(ct as ContentType) as Imagery[]);
    const contentTypeInfo = contentTypeDescriptions.get(ct as ContentType)!;
    const expanded = (ct === 'em');
    
    if (imagery !== undefined && imagery.length > 0) {
      return <ImageCheckboxCollection
              key={ct}
              imagery={imagery}
              checkState={checkState}
              handleImageChange={handleImageChange}
              contentType={ct}
              contentTypeInfo={contentTypeInfo}
              accordionExpanded={expanded}/>;
    }
    return null;
  });

  return <div className={classes.control}>{checkboxLists}</div>;
}

function LayerFilter({ value, onChange } : LayerFilterProps) {
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


export default function LayerCheckboxList({
  dataset,
  checkState,
  handleImageChange,
  handleFilterChange,
  filter,
}: LayerCheckboxListProps) {
  if (filter === undefined) {filter = ""}
  return (
    <>
      <Typography variant="h6">2. Select layers for the view</Typography>
      <LayerFilter value={filter} onChange={handleFilterChange} />
      <FilteredLayersList
        dataset={dataset}
        checkState={checkState}
        handleImageChange={handleImageChange}
        filter={filter}
      />
    </>
  );
}
