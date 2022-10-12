import React from "react";
import {
  Chip,
  Grid,
  Box,
  createStyles,
  makeStyles,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
} from "@material-ui/core";
import { HashLink } from "react-router-hash-link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { NewsPostProps } from "../api/posts";
import { usePosts } from "../context/PostsContext";

import banner from "./cosem_banner.jpg";

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

const MyImage = ({ ...props }: any) => {
  const classes = useStyles();
  return <img className={classes.postImage} {...props} />;
};

export default function NewsPost({
  title,
  content,
  authors,
  tags,
  date,
}: NewsPostProps) {
  const classes = useStyles();
  return (
    <Box className={classes.newsPost}>
      <Typography variant="h4">
        {Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date)}
      </Typography>
      <HashLink to={"/news#" + title.replace(" ", "-").toLowerCase()}>
        <Typography variant="h5">{title}</Typography>
      </HashLink>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ img: MyImage }}
      >
        {content}
      </ReactMarkdown>
      <Typography variant="subtitle2">
        Posted on{" "}
        {Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date())}
      </Typography>
      <Typography variant="subtitle2">
        Written by {authors.join(", ")}
      </Typography>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} variant="outlined" />
      ))}
    </Box>
  );
}

export function NewsPostSummary({ title, authors, date }: NewsPostProps) {
  return (
    <Card style={{minHeight: "400px"}}>
      <CardMedia component="img" height="140" image={banner} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="subtitle1">
          {Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date)}
        </Typography>
        <Typography variant="body2">Summary / Abstract text here.</Typography>
        <Typography variant="subtitle2">
          Written by {authors.join(", ")}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

const latestPostsCount = 5;

export function NewsPostCollection() {
  // fetch the data here
  const { state } = usePosts();
  const classes = useStyles();

  const sortedPosts = state.posts.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  const latestPosts = sortedPosts.slice(0, latestPostsCount);
  const otherPosts = sortedPosts.slice(latestPostsCount);

  return (
    <Box className={classes.root}>
      <Typography variant="h3" className="">
        News and Announcements
      </Typography>
      <Typography variant="h5">
        Latest Posts
      </Typography>
      <Grid container direction="row" spacing={2} style={{margin: "1em 0 1em 0"}}>
        {latestPosts.map((post, idx) => (
          <Grid item key={idx} sm={4}>
            <NewsPostSummary {...post} />
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" className="">
        The Rest
      </Typography>
      <Grid container direction="row">
        <Grid item container direction="column" xs={12}>
          {otherPosts.map((post, idx) => (
            <Grid item key={idx}>
              <NewsPost {...post} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
