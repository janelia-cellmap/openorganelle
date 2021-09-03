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

export default function DatasetFilters() {
  const { appState, setPermanent } = useContext(AppContext);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPermanent({ sortBy: event.target.value as string });
  };

  const options = Object.keys(sortFunctions).map(option => (
    <MenuItem key={option} value={option}>
      {sortFunctions[option].display}
    </MenuItem>
  ));

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const tags = [
    { title: 'Tag1', value: 't1' },
    { title: 'Tag2', value: 't2' },
    { title: 'Tag3', value: 't3' },
    { title: 'Tag4', value: 't4' },
    { title: 'Tag5', value: 't5' },
    { title: 'bigTag5', value: 't5' },
    { title: 'littleTag5', value: 't5' },
    { title: 'anotherTag5', value: 't5' },
    { title: 'bestTag5', value: 't5' },
    { title: 'awesomeTag5', value: 't5' },
  ];

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
          getOptionLabel={option => option.title}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.title}
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
