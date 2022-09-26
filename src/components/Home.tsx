import React from "react";
import { Grid} from "@material-ui/core";
import DatasetLayout from "./DatasetLayout";
import { NewsPostCollection } from "./NewsPost";


export default function Home() {
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
