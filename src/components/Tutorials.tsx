import React from "react";
import Typography from "@material-ui/core/Typography";

export default function Tutorials() {
  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Open Organelle Tutorials
      </Typography>
    <Typography variant="h4"> How to navigate website</Typography>
    <Typography variant="h5">
    Data
    </Typography>
    <Typography variant="h5">
    Software
    </Typography>
    <Typography variant="h5">
    Tutorials
    </Typography>
    <Typography variant="h5">
    Publications
    </Typography>
    <Typography variant="h4">How to navigate data (organization)</Typography>
    General data and metadata structure?
    <Typography variant="h4">How to select layers for visualization</Typography>
    <Typography variant="h4">How to find pre-made data views</Typography>
    Individual datapages and publication page
    <Typography variant="h4">How to use Neuroglancer</Typography>
    Piggy-back on already available documentation?
    <Typography variant="h4">How to open data in FIJI</Typography>
    John’s n5 plugin. FIJI icon next to url will copy url to use in the plugin?
    <Typography variant="h4">Downloading data</Typography>
    point people to python / command line tools for downloading stuff from s3
    <Typography variant="h4">How to download analysis</Typography>
    Csv file on datapage?

    </div>
  );
}
