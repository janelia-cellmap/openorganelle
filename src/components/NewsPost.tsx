import React from "react";
import {
  Chip,
  Box,
  createStyles,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./NewsPost.css";

import { usePosts } from "../context/PostsContext";
import { postSlug } from "../utils/newsposts";

type PostParams = {
  slug: string;
};

const useStyles: any = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    newsPost: {
      maxWidth: "800px",
      margin: "auto",
    },
    postImage: {
      maxWidth: "100%",
    },
  })
);

const MyImage = ({ ...props }: any) => {
  const classes = useStyles();
  return <img className={classes.postImage} {...props} />;
};

export default function NewsPost() {
  const classes = useStyles();
  const { state } = usePosts();
  const { slug } = useParams<PostParams>();

  const selectedPost = state.posts.find(
    (post) => postSlug(post.date, post.title) === slug
  );

  if (!selectedPost) {
    return <p>Loading...</p>;
  }

  const {
    title,
    content,
    authors,
    tags,
    date,
    thumbnail_url,
    summary,
  } = selectedPost;

  return (
    <Box className={classes.newsPost}>
      <Helmet>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@OpenOrganelle" />
        <meta name="twitter:title" content={`OpenOrganelle - ${title}`} />
        <meta name="twitter:description" content={summary} />
        <meta name="twitter:image" content={thumbnail_url} />
    <title>OpenOrganelle - {title}</title>
      </Helmet>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="subtitle1">
        {Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date)}
      </Typography>
      <div className="markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{ img: MyImage }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <Typography variant="subtitle2">
        Written by {authors.join(", ")}
      </Typography>
      {tags.map((tag) => (
        <Chip
          style={{ marginRight: "1em" }}
          key={tag}
          label={tag}
          variant="outlined"
        />
      ))}
    </Box>
  );
}
