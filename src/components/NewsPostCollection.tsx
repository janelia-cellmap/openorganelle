import React from "react";
import {
  Grid,
  Box,
  createStyles,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { usePosts } from "../context/PostsContext";
import NewsPostSummary from "./NewsPostSummary";

const useStyles: any = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    postImage: {
      width: "100%",
    },
  })
);

export default function NewsPostCollection() {
  // fetch the data here
  const { state } = usePosts();
  const classes = useStyles();

  const sortedPosts = state.posts.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <Box className={classes.root}>
      <Typography variant="h3" className="">
        News and Announcements
      </Typography>
      <Grid container direction="row" spacing={2} style={{margin: "1em 0 1em 0"}}>
        {sortedPosts.map((post, idx) => (
          <Grid item key={idx} sm={4}>
            <NewsPostSummary {...post} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
