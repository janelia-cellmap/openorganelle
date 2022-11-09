import {
  Checkbox,
  createStyles,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  Typography
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState, useEffect } from "react";
import { Image, Dataset } from "../api/datasets";
import { ControlCamera } from "@material-ui/icons";

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
      height: "300px",
      overflow: "scroll"
    },
    divider: {
      marginRight: "-1px"
    }
  })
);



interface LayerCheckboxListProps {
  images: Image[];
  checkState: Set<string>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string | undefined;
}

interface FilteredLayerListProps {
  images: Image[];
  checkState: Set<string>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string | undefined;
}

interface LayerFilterProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
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

function FilteredLayersList({ images,
                              checkState, 
                              handleImageChange, 
                              filter}: FilteredLayerListProps) {
  const classes = useStyles();
  const [imagesDisplayed, setImages] = useState<Image[]>(images);

  useEffect(() => {
    let filteredImages = imagesDisplayed
    if (filter) {
      // TODO: make this case insensitive
       filteredImages = images.filter(v =>
        v.description.toLowerCase().includes(filter.toLowerCase()) ||
        v.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    setImages(
      filteredImages);
  }, [images, filter]);

  const selectedCheckBoxes: ReturnType<typeof FormControlLabel>[] = []
  const unselectedCheckBoxes: ReturnType<typeof FormControlLabel>[] = []

  images.forEach((image) => {
    const checkbox = <FormControlLabel
        control={
          <Checkbox
            checked={checkState.has(image.name)}
            onChange={handleImageChange}
            color="primary"
            name={image.name}
            size="small"
          />
        }
        label={image.description}
        key={`${image.name}`}
      />
      if (checkState.has(image.name)) {
        selectedCheckBoxes.push(checkbox)  
      }
      else {
      unselectedCheckBoxes.push(checkbox)
      }
  })

return (<>
<div className={classes.control}>
<FormGroup>{unselectedCheckBoxes}</FormGroup>
</div>
<Divider></Divider>
<div className={classes.control}>
<FormGroup>{selectedCheckBoxes}</FormGroup>
</div>
</>)
}

export default function LayerCheckboxList({
  images,
  checkState,
  handleImageChange,
  handleFilterChange,
  filter,
}: LayerCheckboxListProps) {
  if (filter === undefined) {filter = ""}
  return (
    <>
      <Typography variant="h6">2. Select images</Typography>
      <LayerFilter value={filter} onChange={handleFilterChange} />
      <FilteredLayersList
        images={images}
        checkState={checkState}
        handleImageChange={handleImageChange}
        filter={filter}
      />
    </>
  );
}
