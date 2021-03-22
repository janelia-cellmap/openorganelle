import React, {
  useState,
  useContext,
} from "react";

import Pagination from "@material-ui/lab/Pagination";
import Typography from "@material-ui/core/Typography";
import { Dataset} from "../api/datasets";
import { AppContext } from "../context/AppContext";
import DatasetTile from "./DatasetTile";

export default function DatasetList() {
  const {appState} = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 10;

  const datasets: Map<string, Dataset> = appState.datasets;

  const rangeStart = (currentPage - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;
  const totalPages = Math.ceil(datasets.size / datasetsPerPage);
  const datasetKeys = Array.from(datasets.keys());
  // sort by number of volumes; this will break when the metadata changes to putting volumes in an array
  const datasetKeysSorted = datasetKeys.sort((a, b) => Array.from(datasets.get(b)!.volumes.keys()).length - Array.from(datasets.get(a)!.volumes.keys()).length); 
  const displayedDatasets = datasetKeysSorted
    .slice(rangeStart, rangeEnd)
    .map((k, i) => (
      <DatasetTile
        datasetKey={k}
        key={`${k}_${rangeStart}_${i}`}
      />
    ));

  return (
    <div>
      <Typography variant="h5">
        Datasets {rangeStart + 1} to {Math.min(rangeEnd, datasets.size)} of{" "}
        {datasets.size}
      </Typography>
      {datasets.size > datasetsPerPage && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      )}
      {displayedDatasets}
      {datasets.size > datasetsPerPage && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
        />
      )}
    </div>
  );
}
