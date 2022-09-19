import React, { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { makeDatasets } from "../api/datasets";
import { Grid} from "@material-ui/core";
import DatasetLayout from "./DatasetLayout";
import { NewsPostCollection } from "./NewsPost";

export default function Home() {
  const {appState, setAppState} = useContext(AppContext);

  // Update the global datasets var when Home renders for the first time
  useEffect(() => {
    setAppState({ ...appState, datasetsLoading: true });
    makeDatasets(appState.metadataEndpoint).then(ds =>
      setAppState({ ...appState, datasets: ds, datasetsLoading: false })
    );
  }, []); 

  return (
    <div className="content">
      <Grid>
        <Grid item>
          <NewsPostCollection/>
        </Grid>
        <Grid item>
          <DatasetLayout></DatasetLayout>
        </Grid>
      </Grid>
    </div>
  );
}
