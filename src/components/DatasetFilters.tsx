import React, { useContext } from "react";

import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import { AppContext } from "../context/AppContext";
import sortFunctions from "../utils/sortingFunctions";
import { fetchDatasets } from "../api/datasets";
import { useQuery } from "react-query";
import { DatasetTag, OSet } from "../types/tags";

export default function DatasetFilters({onFilterChange}: {onFilterChange?: () => void}) {
  const { appState, setPermanent, setAppState} = useContext(AppContext);

  const { isLoading, data, error } = useQuery('datasets', async () => fetchDatasets());

  if (isLoading) {
    return <>Loading datasets....</>
  }

  if (error) {
    return <>Error loading datasets: {(error as Error).message}</>
  }

  const datasets = data!

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPermanent({ sortBy: event.target.value as string });
  };

  const handleFilterChange = (event: React.ChangeEvent<{}>, value: DatasetTag[] | undefined) => {
    setAppState({...appState, datasetFilter: value});
    if  (onFilterChange) {
      onFilterChange();
    }
  };

  const options = Object.keys(sortFunctions).map(option => (
    <MenuItem key={option} value={option}>
      {sortFunctions[option].title}
    </MenuItem>
  ));

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const tags: DatasetTag[] = [];
  const tagSet: OSet<DatasetTag> = new OSet();
  for (const dataset of datasets.values()) {
    for (const tag of dataset.tags.map.values())
      {
        tagSet.add(tag);
      }
  }

  tags.push(...Array.from(tagSet.map.values()));
  tags.sort((a, b) => {
    if (a.category < b.category) {return -1}
    if (a.category > b.category) {return 1}
    return 0
  });

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">Sort by</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={appState.sortBy}
            onChange={handleChange}
          >
            {options}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          multiple
          size="small"
          id="dataset-filters"
          options={tags}
          disableCloseOnSelect
          value={appState.datasetFilter}
          onChange={handleFilterChange}
          groupBy={(option) => option.category}
          getOptionLabel={option => option.value}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.value}
            </React.Fragment>
          )}
          style={{ width: 500 }}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Filter by"
              placeholder="Filters"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
