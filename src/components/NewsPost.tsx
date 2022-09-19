import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core"

interface NewsPostProps{
    content: string
}

export default function NewsPost({content} : NewsPostProps){
    return <Typography>{content}</Typography>
}

export function NewsPostCollection(){
    return <Box><Grid container>
            <Grid item>
                <NewsPost content="News item 1"/>
            </Grid>
            <Grid item>
                <NewsPost content = "News item 2"/>
            </Grid>
        </Grid>
        </Box>

}