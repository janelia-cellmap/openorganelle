import React, { useState } from "react";
import {
  Grid,
  Box,
  createStyles,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { usePosts } from "../context/PostsContext";
import NewsPostSummary from "./NewsPostSummary";
import NewsPostFilters from "./NewsPostFilters";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const sortedPosts = state.posts.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const tags = state.posts
    .reduce((prevPost: string[], currentPost) => {
      return [...new Set([...prevPost, ...currentPost.tags])];
    }, [])
    .sort();

  // filter the posts, based on the selected tags.
  const filteredPosts =
    // if none are selected, then don't filter anything and show all.
    selectedTags.length > 0
      ? sortedPosts.filter((post) => {
          return post.tags.some((tag) => selectedTags.includes(tag));
        })
      : sortedPosts;

  return (
    <Box className={classes.root}>
      <Typography variant="h3" className="">
        News and Announcements
      </Typography>
      <NewsPostFilters
        tags={tags}
        selected={selectedTags}
        onClick={setSelectedTags}
      />
      <Grid
        container
        direction="row"
        spacing={2}
        style={{ margin: "1em 0 1em 0" }}
      >
        {filteredPosts.map((post, idx) => (
          <Grid item key={idx} sm={4}>
            <NewsPostSummary {...post} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
