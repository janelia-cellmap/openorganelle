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
import { Dataset, ITag, OSet} from "../api/datasets";
import { stableValueHash } from "react-query/types/core/utils";

export default function DatasetFilters() {
  const { appState, setPermanent } = useContext(AppContext);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPermanent({ sortBy: event.target.value as string });
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
  }) 
  console.log(tags)
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
