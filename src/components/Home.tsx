import React from "react";
import { Grid} from "@material-ui/core";
import DatasetLayout from "./DatasetLayout";
import NewsPostCollection from "./NewsPostCollection";


export default function Home() {
  return (
    <div className="content">
      <Grid>
        <Grid item>
          <NewsPostCollection/>
        </Grid>
        <Grid item>
          <DatasetLayout/>
        </Grid>
      </Grid>
    </div>
  );
}
