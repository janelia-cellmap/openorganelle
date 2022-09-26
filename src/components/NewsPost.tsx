import React, {useContext} from "react";
import { Box, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core"
import { HashLink } from "react-router-hash-link";
import ReactMarkdown, { uriTransformer } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { AppContext } from "../context/AppContext";
import { NewsPostProps } from "../api/posts";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: 'red'
    },
    postImage: {
        width: "300px"
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

export default function NewsPost({title, content, authors, date, tags}: NewsPostProps){
    const classes = useStyles();
    return <Box className={classes.newsPost}>
        <HashLink to={"/news#" + title.replace(" ", "-")}><Typography variant="h2">{title}</Typography></HashLink>
        <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        children={content}
        components={{img: MyImage}}/>
        <Typography variant="subtitle2">Posted by {authors} on {date.toString()}</Typography>
        <Typography variant="subtitle2">{tags}</Typography>
        </Box>
}

export function NewsPostCollection(){
    const {appState} = useContext(AppContext);
    const classes = useStyles();
    return <Box className = {classes.root}>
        <Typography variant="h1">News and Announcements</Typography>
        <Grid container direction="row">
        <Grid item container direction="column" xs={8}>
            {appState.posts.map((p, idx) => <Grid item key={idx}><NewsPost title={p.title} content={p.content} authors={p.authors} date={p.date} tags={p.tags}/></Grid>)}
            </Grid>
            <Grid item container direction="column" xs={4}>
               <Grid item><Typography variant='h3'>Archives</Typography></Grid> 
            </Grid>
        </Grid>
        </Box>

}