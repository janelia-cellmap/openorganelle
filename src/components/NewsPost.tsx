import React, {useEffect, useState} from "react";
import { Box, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core"
import { HashLink } from "react-router-hash-link";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Octokit } from "@octokit/core";
import matter from 'gray-matter';

interface NewsPostProps{
    title: string
    content: string
    authors: string[]
    date: Date
    tags: string[]
}

const octokit = new Octokit({});

export default function NewsPost({title, content, authors, date, tags} : NewsPostProps){
    return <Box>
        <HashLink to={"/news#" + title.replace(" ", "-")}><Typography variant="h2">{title}</Typography></HashLink>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        <Typography variant="subtitle2">Posted by {authors} on {date.toDateString()}</Typography>
        <Typography variant="subtitle2">{tags}</Typography>
        </Box>
}

export function NewsPostCollection(){
    const [posts, setPosts] = useState([])
    
    useEffect(() => {async function getPosts() {
        const apiResponse = await octokit.request("Get /repos/{owner}/{repo}/contents/{path}", {
            owner: 'janelia-cosem',
            repo: 'openorganelle-blog',
            path: 'posts'
        })
        console.log(apiResponse.data)
        const posts = await Promise.all(apiResponse.data.map((d: any) => {fetch("https://raw.githubusercontent.com/janelia-cosem/openorganelle-blog/main/posts/2022-09-16-empanada.md")}))
        console.log(posts[0].text());
        console.log(posts.map((t) => {matter({content: t})}))
        setPosts(posts)}
        getPosts()}, [])

    
    return <Box><Typography variant="h1">News and Announcements</Typography>
    <Grid container direction="row">
    <Grid item container direction="column" xs={8}>
            {posts.map((p, idx) => <Grid item key={idx}><NewsPost title={p.title} content={p.content} authors={p.authors} date={p.date} tags={p.tags}/></Grid>)}
            </Grid>
            <Grid item container direction="column" xs={4}>
               <Grid item><Typography variant='h3'>Archives</Typography></Grid> 
            </Grid>
        </Grid>
        </Box>

}