import React from "react";
import { Grid} from "@material-ui/core";
import DatasetLayout from "./DatasetLayout";
import NewsPostCarousel from "./NewsPostCarousel";


export default function Home() {
  return (
    <div className="content">
      <Grid container spacing={2}>
        <Grid item >
          <NewsPostCarousel/>
        </Grid>
        <Grid item>
          <DatasetLayout latestOnly/>
        </Grid>
      </Grid>
    </div>
  );
}
