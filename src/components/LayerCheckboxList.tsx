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
import {ContentTypeEnum as ContentType} from "../api/manifest";
import {contentTypeDescriptions, Dataset, Volume } from "../api/datasets";
import VolumeCheckboxCollection from "./LayerGroup";
import { VolumeCheckStates } from "./DatasetPaper";

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
  checkState: Map<string, VolumeCheckStates>;
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLayerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string | undefined;
}

interface FilteredLayerListProps {
  dataset: Dataset;
  checkState: Map<string, VolumeCheckStates>;
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLayerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string | undefined;
}

interface LayerFilterProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function FilteredLayersList({ dataset, checkState, handleVolumeChange, handleLayerChange, filter}: FilteredLayerListProps) {
  const classes = useStyles();
  const volumesListInit: Volume[] = []
  const [volumesList, setVolumes] = useState(volumesListInit);
  const volumeGroups: Map<ContentType, Volume[]> = new Map();

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
    setVolumes(
      filteredVolumes);
  }, [dataset, filter]);

  volumesList.forEach((v: Volume) => {
    if (volumeGroups.get(v.contentType) === undefined) {
      volumeGroups.set(v.contentType, []);
    }
    volumeGroups.get(v.contentType)!.push(v);
  });

  const checkboxLists = Array.from(contentTypeDescriptions.keys()).map((ct) => {
    let volumes = (volumeGroups.get(ct as ContentType) as Volume[]);
    let contentTypeInfo = contentTypeDescriptions.get(ct as ContentType)!;
    let expanded = (ct === 'em');
    
    if (volumes !== undefined && volumes.length > 0) {
      return <VolumeCheckboxCollection
              key={ct}
              volumes={volumes}
              checkState={checkState}
              handleVolumeChange={handleVolumeChange}
              contentType={ct}
              contentTypeInfo={contentTypeInfo}
              accordionExpanded={expanded}
              handleLayerChange={handleLayerChange}/>;
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
  handleVolumeChange,
  handleLayerChange,
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
        handleVolumeChange={handleVolumeChange}
        handleLayerChange={handleLayerChange}
        filter={filter}
      />
    </>
  );
}
