import React from "react";
import { Grid, Typography } from "@material-ui/core";
import DatasetLayout from "./DatasetLayout";
import NewsPostCarousel from "./NewsPostCarousel";

export default function Home() {
  return (
    <div className="content">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NewsPostCarousel />
        </Grid>
        <hr style={{width: "100%", backgroundColor: "rgba(0,0,0,0.1)", border: "none", height: "1px"}}/>
        <Grid item xs={12}>
          <DatasetLayout latestOnly />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h3"
            gutterBottom
            style={{ marginTop: "2em", textAlign: "left" }}
          >
            Welcome to HHMI Janelia’s OpenOrganelle
          </Typography>

          <p>
            A data portal for volume electron microscopy datasets and
            accompanying segmentations available for exploration.
          </p>
          <p>
          Many of the datasets hosted here were acquired with the enhanced focused ion beam scanning electron microscopy (FIB-SEM)
          technology developed at Janelia. Accompanying many of these EM volumes are automated segmentations and analyses of intracellular sub-structures.
          </p>

          <p>
          Be sure to check out our <a href="/news">News and Announcements page</a> to see what is new and learn more about the datasets.
          You can explore the gallery of organelles on the <a href="/organelles">Organelles page</a> or head to the <a href="/faq">FAQ page</a> to learn how to work with the data yourself.
          To dive into the details of the methods behind the dataset generation head over to our <a href="/publications">Publications page</a>.
          </p>
        </Grid>
      </Grid>
    </div>
  );
}
