
import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import DatasetViewCard from "./DatasetViewCard";
import { DatasetView } from "../api/datasets";

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
    })
);

interface DatasetViewListProps {
    views: DatasetView[]
    checkState: boolean[]
    handleChange: any
}

export default function DatasetViewList({views, checkState, handleChange}: DatasetViewListProps){
    const classes = useStyles();
    return <Grid container direction='column' className={classes.root}>
        <Typography variant="h6">Select view</Typography>
        {views.map((v, idx) =>
            <Grid item key={idx}>
                <DatasetViewCard view={v} handleChange={handleChange} checked={checkState[idx]} name={idx.toString()} /
            ></Grid>)
        }</Grid>
}