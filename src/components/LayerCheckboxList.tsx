import React, { useState, useEffect } from "react";
import {
  createStyles,
  FormControl,
  makeStyles,
  Typography,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from "@mui/material";

import {Search} from "@mui/icons-material";

import {ContentType, contentTypeDescriptions, Dataset } from "../api/datasets";
import ImageCheckboxCollection from "./LayerGroup";
import { ImageCheckState } from "./DatasetPaper";
import { Image } from "../api/datasets";

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
  checkState: Map<string, ImageCheckState>;
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLayerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string | undefined;
}

interface FilteredLayerListProps {
  dataset: Dataset;
  checkState: Map<string, ImageCheckState>;
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
  const imagesInit: Image[] = []
  const [images, setImages] = useState(imagesInit);
  const imageGroups: Map<ContentType, Image[]> = new Map();

  useEffect(() => {
    // filter volumes based on filter string
    let filteredVolumes = Array.from(dataset.images.values());
    if (filter) {
      // TODO: make this case insensitive
      filteredVolumes = filteredVolumes.filter(v =>
        v.description.toLowerCase().includes(filter.toLowerCase()) ||
        v.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    setImages(
      filteredVolumes);
  }, [dataset, filter]);

  images.forEach((v: Image) => {
    if (imageGroups.get(v.contentType) === undefined) {
      imageGroups.set(v.contentType, []);
    }
    imageGroups.get(v.contentType)!.push(v);
  });

  const checkboxLists = Array.from(contentTypeDescriptions.keys()).map((ct) => {
    const images = (imageGroups.get(ct as ContentType) as Image[]);
    const contentTypeInfo = contentTypeDescriptions.get(ct as ContentType)!;
    const expanded = (ct === 'em');
    
    if (images !== undefined && images.length > 0) {
      return <ImageCheckboxCollection
              key={ct}
              images={images}
              checkState={checkState}
              handleImageChange={handleVolumeChange}
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
            <Search />
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
