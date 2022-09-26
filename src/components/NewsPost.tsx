import React, {useContext, useEffect} from "react";
import { Box, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core"
import { HashLink } from "react-router-hash-link";
import ReactMarkdown, { uriTransformer } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { AppContext } from "../context/AppContext";
import { getPosts, NewsPostProps } from "../api/posts";

export default function NewsPost({title, content, authors, date, tags}: NewsPostProps){
    return <Box>
        <HashLink to={"/news#" + title.replace(" ", "-")}><Typography variant="h2">{title}</Typography></HashLink>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} transformImageUri={uriTransformer}>{content}</ReactMarkdown>
        <Typography variant="subtitle2">Posted by {authors} on {date.toString()}</Typography>
        <Typography variant="subtitle2">{tags}</Typography>
        </Box>
}

export function NewsPostCollection(){
    const {appState} = useContext(AppContext);

    return <Box><Typography variant="h1">News and Announcements</Typography>
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