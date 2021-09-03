import React, { useContext } from "react";

import Grid from "@material-ui/core/Grid";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { AppContext } from "../context/AppContext";
import sortFunctions from "../utils/sortingFunctions";

export default function DatasetFilters() {

  const { appState, setPermanent } = useContext(AppContext);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPermanent({ sortBy: event.target.value as string});
  }

  const options = Object.keys(sortFunctions).map((option) => (
    <MenuItem key={option} value={option}>{sortFunctions[option].display}</MenuItem>
  ));

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
        <p>Filters</p>
      </Grid>
    </Grid>
  );
}
