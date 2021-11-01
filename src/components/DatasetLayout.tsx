import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
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
import { useQueryString } from "../utils/customHooks";
import DatasetFilters from "./DatasetFilters";

export default function DatasetLayout() {
  const query = useQueryString();
  const history = useHistory();
  const page = parseInt(query.get("page") || "1");
  const { appState, setPermanent } = useContext(AppContext);

  const { datasetGrid: compact } = appState;
  const datasetsPerPage = compact ? 12 : 10;

  const datasets: Map<string, Dataset> = appState.datasets;

  const rangeStart = (page - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.size / datasetsPerPage);


  function setCurrentPage(page: number) {
    query.set("page", page.toString());
    history.push({
      pathname: "",
      search: query.toString()
    });
  }

  const datasetsFiltered = [...datasets].filter(dataset => {
    // if any tag in appState.datasetFilter is missing from the
    // tags in the dataset, then we don't have a match, so
    // return false.
    if (appState.datasetFilter) {
      for (let tag of appState.datasetFilter) {
        console.log({tag, dataset});
        if (!dataset[1].tags.has(tag)) {
          console.log('no match');
          return false;
        }
      }
    }
    return true;
  });
  console.log(datasetsFiltered);

  // sort by number of volumes; this will break when the metadata changes to putting volumes in an array
<<<<<<< HEAD
  const datasetsSorted = [...datasets].sort(sortFunctions[appState.sortBy].func)
=======
  const datasetsSorted = datasetsFiltered.sort(sortFunctions[appState.sortBy].func)
>>>>>>> cb0a4f6596b88f22f089f2b834b3c2ac0fe0056d

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

  if (datasets.size < 1) {
    return <p>Loading...</p>;
  }
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
              page={page}
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
              page={page}
              onChange={(e, value) => setCurrentPage(value)}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
