import React, { useState, useContext } from "react";

import Pagination from "@material-ui/lab/Pagination";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Dataset } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import DatasetTile from "./DatasetTile";

export default function DatasetLayout() {
  const { appState, setPermanent } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);

  const { datasetGrid: compact } = appState;
  const datasetsPerPage = compact ? 12 : 10;

  const datasets: Map<string, Dataset> = appState.datasets;

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.size / datasetsPerPage);
  const datasetKeys = Array.from(datasets.keys());

  // sort by number of volumes; this will break when the metadata changes to putting volumes in an array
  const datasetKeysSorted = datasetKeys.sort(
    (a, b) =>
      Array.from(datasets.get(b)!.volumes.keys()).length -
      Array.from(datasets.get(a)!.volumes.keys()).length
  );
  const displayedDatasets = datasetKeysSorted
    .slice(rangeStart, rangeEnd)
    .map((k, i) => {
      if (compact) {
        return (
          <DatasetTile
            datasetKey={k}
            compact={compact}
            key={`${k}_${rangeStart}_${i}`}
          />
        );
      }
      return <DatasetTile datasetKey={k} key={`${k}_${rangeStart}_${i}`} />;
    });

  const handleCompactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermanent({ datasetGrid: event.target.checked });
  };

  return (
    <div>
      <Typography variant="h5">
        Datasets {rangeStart + 1} to {Math.min(rangeEnd, datasets.size)} of{" "}
        {datasets.size}
      </Typography>
      <Grid container spacing={1}>
        <Grid item sm={10} xs={12}>
          {datasets.size > datasetsPerPage && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
            />
          )}
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
