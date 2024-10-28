import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import { TextField } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";


import { AppContext } from "../context/AppContext";
import { fetchDatasets } from "../api/datasets";
import sortFunctions from "../utils/sortingFunctions";
import DatasetTile from "./DatasetTile";
import { useQueryString } from "../utils/customHooks";
import DatasetFilters from "./DatasetFilters";
import { useQuery } from "react-query";

interface DatasetLayoutProps {
  latestOnly: boolean;
}

const useStyles: any = makeStyles((theme: Theme) => createStyles({
  search: {
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left'
    },
  },
  filter: {
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right'
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left'
    },
  }
}));



export default function DatasetLayout({
  latestOnly = false,
}: DatasetLayoutProps) {
  const query = useQueryString();
  const classes = useStyles();
  const history = useHistory();
  const page = parseInt(query.get("page") || "1");
  const { appState, setPermanent} = useContext(AppContext);

  const { datasetGrid: compact } = appState;
  const datasetsPerPage = compact ? 12 : 10;

  const { isLoading, data, error } = useQuery("datasets", async () =>
  fetchDatasets()
  );
  if (isLoading) {
    return <>Loading dataset metadata...</>;
  }
  if (error) {
    return <>There was an error fetching dataset metadata.</>;
  }
  const datasets = data!;
  const rangeStart = (page - 1) * datasetsPerPage;
  const rangeEnd = rangeStart + datasetsPerPage;

  function setCurrentPage(page: number) {
    query.set("page", page.toString());
    history.push({
      pathname: "",
      search: query.toString(),
    });
  }

  const datasetsFiltered = [...datasets].filter((dataset) => {
    // if any tag in appState.datasetFilter is missing from the
    // tags in the dataset, then we don't have a match, so
    // return false.
    // TODO: need to change the filtering so that each category can match if any
    // of the selected filters in that category are matched and not just if all
    // of them are.
    if (appState.datasetFilter && appState.datasetFilter.length > 0) {
      // set up a lookup hash to keep track of categories that have a positive hit
      const filterCategories: Record<string, boolean> = {};
      // loop over each of the selected filters
      for (const tag of appState.datasetFilter) {
        // if the dataset has the filter tag, then set the matching category to true
        if (dataset[1].tags.has(tag)) {
          filterCategories[tag.category] = true;
        } else {
          // If the category hasn't been seen yet or doesn't already have a positive hit
          // from another filter, then set it to false.
          if (
            !filterCategories[tag.category] ||
            filterCategories[tag.category] !== true
          ) {
            filterCategories[tag.category] = false;
          }
        }
      }
      // now that all the filters have been checked, throw out the dataset if it doesn't
      // have at least one positive match to a filter tag.
      const hasFalseKeys = Object.keys(filterCategories).some(
        (k) => !filterCategories[k]
      );
      if (hasFalseKeys) {
        return false;
      }
    }
    // by default, keep the data set in the filtered list.
    return true;
  });

  // sort by number of volumes; this will break when the metadata changes to putting volumes in an array

  const datasetsSearched = [...datasetsFiltered].filter(
    ([key, dataset_info]) => {
      return (
        dataset_info
        .description
        .toLowerCase()
        .includes(appState.searchFilter!.toLowerCase()) ||
        key
        .toLowerCase()
        .includes(appState.searchFilter!.toLowerCase())
      );
    }
  );

  const datasetsSorted = datasetsSearched.sort(
    sortFunctions[appState.sortBy].func
  );

  const totalPages = datasetsSorted.length==0 ? 1 : Math.ceil(datasetsSorted.length / datasetsPerPage);

  const displayedDatasets = datasetsSorted
    .slice(rangeStart, rangeEnd)
    .map(([name, dataset], i) => {
      if (compact) {
        return (
          <DatasetTile
            dataset={dataset}
            compact={compact}
            key={`${name}_${rangeStart}_${i}`}
          />
        );
      }
      return (
        <DatasetTile dataset={dataset} key={`${name}_${rangeStart}_${i}`} />
      );
    });

  const handleCompactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermanent({ datasetGrid: event.target.checked });
  };

  const handleSearchChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setPermanent({searchFilter: event.target.value as string});
  };

  if (datasets.size < 1) {
    return <p>Loading...</p>;
  }
  const handleFilterToggle = () => {
    setPermanent({ showFilters: !appState.showFilters });
  };

  if (latestOnly) {
    const latestDatasets = [...datasets].sort(
      sortFunctions['added'].func
    )
    .slice(0,4)
      .map(([name, dataset], i) => {
        if (compact) {
          return (
            <DatasetTile
              dataset={dataset}
              compact={compact}
              key={`${name}_${rangeStart}_${i}`}
            />
          );
        }
        return (
          <DatasetTile dataset={dataset} key={`${name}_${rangeStart}_${i}`} />
        );
      });

    return (
      <Grid container spacing={1} justify="space-around">
        <Grid item xs={12} sm={6}>
          <Typography variant="h4">Latest Datasets</Typography>
        </Grid>
        <Grid item xs={12} sm={6} style={{textAlign: "right", paddingTop: "1em"}}>
          <Link to="/datasets">All Datasets &raquo;</Link>
        </Grid>
            {latestDatasets}
      </Grid>
    );
  }

  const datasetCount = datasetsSorted.length >= 1 ? <Typography variant="h5">
                                        Datasets {rangeStart + 1} to{" "}
                                      {Math.min(rangeEnd, datasetsSorted.length)} of {datasets.size}
                                      </Typography> :
                                      <Typography variant="h5">
                                        No datasets found
                                      </Typography>

  return (
    <div>
      {datasetCount}
      <Grid container spacing={1}>
        <Grid item md={4} sm={8} xs={12}>
          {datasets.size > datasetsPerPage && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setCurrentPage(value)}
            />
          )}
        </Grid>
        <Grid item md={3} sm={4} xs={12} className={classes.search}>
        <TextField
          //inputProps={{style: { textAlign: 'center' }}}
          label="Search datasets"
          //placeholder="Search Dataset"
          id="standard-basic-small"
          style = {{marginTop:-10}}
          defaultValue=""
          size="small"
          variant="standard"
          value={appState.searchFilter}
          onChange={handleSearchChange}
        />
        </Grid>
        <Grid item md={3} sm={6} xs={12} className={classes.filter}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleFilterToggle}
            startIcon={<FilterListIcon />}
          >
            Filter / Sort
          </Button>
        </Grid>
        <Grid item md={2} sm={2} xs={12}>
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
            <DatasetFilters />
          </Grid>
        ) : (
          ""
        )}
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
