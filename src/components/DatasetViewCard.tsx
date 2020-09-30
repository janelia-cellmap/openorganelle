import React from "react";
import { Card, CardContent, Checkbox, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { DatasetView } from "../api/datasets";

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
    })
);

interface DatasetViewCardProps {
    view: DatasetView
    handleChange: any
    checked: boolean
    name: string
  }

export default function DatasetViewCard({view, handleChange, checked, name}: DatasetViewCardProps){
    const classes = useStyles();
    return <Card className={classes.root}>
      <CardContent>
      <Typography variant="subtitle1" component="p">
      {view.name}
        </Typography>
        <Typography variant="body2" component="p">
          {view.description}
        </Typography>
      </CardContent>
      <Checkbox onChange={handleChange} checked={checked} name={name}></Checkbox>
    </Card>
  }