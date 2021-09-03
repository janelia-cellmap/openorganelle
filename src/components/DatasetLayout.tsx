import React, { useState, useContext } from "react";

import Pagination from "@material-ui/lab/Pagination";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import FilterListIcon from '@material-ui/icons/FilterList';

import { Dataset } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import sortFunctions from "../utils/sortingFunctions";
import DatasetTile from "./DatasetTile";
import DatasetFilters from "./DatasetFilters";

export default function DatasetLayout() {
  const { appState, setPermanent } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);

  const { datasetGrid: compact } = appState;
  const datasetsPerPage = compact ? 12 : 10;

  const datasets: Map<string, Dataset> = appState.datasets;

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.size / datasetsPerPage);


  // sort by number of volumes; this will break when the metadata changes to putting volumes in an array
  const datasetsSorted = [...datasets].sort(sortFunctions[appState.sortBy].func)

  const displayedDatasets = datasetsSorted
    .slice(rangeStart, rangeEnd)
    .map((dataset, i) => {
      if (compact) {
        return (
          <DatasetTile
            dataset={dataset}
            compact={compact}
            key={`${dataset[0]}_${rangeStart}_${i}`}
          />
        );
      }
      return <DatasetTile dataset={dataset} key={`${dataset[0]}_${rangeStart}_${i}`} />;
    });

  const handleCompactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermanent({ datasetGrid: event.target.checked });
  };

  const handleFilterToggle = () => {
    setPermanent({ showFilters: !appState.showFilters });
  };

  return (
    <div>
      <Typography variant="h5">
        Datasets {rangeStart + 1} to {Math.min(rangeEnd, datasets.size)} of{" "}
        {datasets.size}
      </Typography>
      <Grid container spacing={1}>
        <Grid item sm={8} xs={12}>
          {datasets.size > datasetsPerPage && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
            />
          )}
        </Grid>
        <Grid item sm={2} xs={12}>
          <Button variant="outlined" color="primary" onClick={handleFilterToggle} startIcon={<FilterListIcon />} >Filter / Sort</Button>
        </Grid>
        <Grid item sm={2} xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={compact}
                  onChange={handleCompactChange}
                  name="compact"
                  color="primary"
                />
              }
              label="Grid"
            />
          </FormGroup>
        </Grid>
        {appState.showFilters ? (
        <Grid item xs={12}>
          <DatasetFilters/>
        </Grid>
        ):""}
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {displayedDatasets}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {datasets.size > datasetsPerPage && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
