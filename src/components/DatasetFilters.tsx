import React, { useContext } from "react";

import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { AppContext } from "../context/AppContext";
import sortFunctions from "../utils/sortingFunctions";
import { ITag, OSet} from "../api/datasets";

export default function DatasetFilters() {
  const { appState, setPermanent, setAppState } = useContext(AppContext);
  const handleChange = (event: SelectChangeEvent, value: unknown) => {
    setPermanent({ sortBy: value as string });
  };

  const handleFilterChange = (event: React.ChangeEvent<{}>, value: Array<ITag> | undefined, reason: string) => {
    setAppState({...appState, datasetFilter: value});
    console.log({event, value, reason});
  };

  const options = Object.keys(sortFunctions).map(option => (
    <MenuItem key={option} value={option}>
      {sortFunctions[option].title}
    </MenuItem>
  ));

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const tags: ITag[] = [];
  const tagSet: OSet<ITag> = new OSet();
  for (let dataset of appState.datasets.values()) {
    for (let tag of dataset.tags.map.values())
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
          renderOption={(props, option, {selected}) => {return (
            <li {...props}>
                <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.value}
            </li>
          )}}
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
