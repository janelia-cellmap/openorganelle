import React from "react";
import { Box, createStyles, makeStyles, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core"
import { HashLink } from "react-router-hash-link";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import { NewsPostProps } from "../api/posts";
import { usePosts } from "../context/PostsContext";

const useStyles: any = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    postImage: {
        width: "100%"
    },
  })
);

const MyImage = ({node, ...props}: any) => {
    const classes = useStyles();
    return (
      <img
        className={classes.postImage}
        {...props}
      />
    );
  };

export default function NewsPost({title, content, authors, tags, date, published}: NewsPostProps){
    const classes = useStyles();
    return <Box className={classes.newsPost}>
        <Typography variant="h4">{Intl.DateTimeFormat("en", {dateStyle: "long"}).format(date)}</Typography>
        <HashLink to={"/news#" + title.replace(" ", "-").toLowerCase()}><Typography variant="h5">{title}</Typography></HashLink>
        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{img: MyImage}}>
        {content}
        </ReactMarkdown>
        <Typography variant="subtitle2">Posted on {Intl.DateTimeFormat("en", {dateStyle: "long"}).format(new Date())}</Typography>
        <Typography variant="subtitle2">Written by {authors}</Typography>
        <Typography variant="subtitle2">{tags}</Typography>
        </Box>
}

export function NewsPostCollection(){
    // fetch the data here
    const {state} = usePosts();
    const classes = useStyles();
    return <Box className = {classes.root}>
        <Typography variant="h3" className="">News and Announcements</Typography>
        <Grid container direction="row">
        <Grid item container direction="column" xs={8}>
            {state.posts.map((p, idx) => <Grid item key={idx}><NewsPost {...p}/></Grid>)}
            </Grid>
            <Grid item container direction="column" xs={4}>
               <Grid item><Typography variant='h3'>Archives</Typography></Grid> 
            </Grid>
        </Grid>
        </Box>

}