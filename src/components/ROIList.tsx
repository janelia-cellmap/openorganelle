import React, { FunctionComponent } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import { DatasetView } from "../api/datasets"
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  }));

interface DatasetViewProps {
    view: DatasetView
}

export const DatasetViewCard: FunctionComponent<DatasetViewProps> = (props: DatasetViewProps) => {
    const classes = useStyles();
    return <Card className={classes.root}>
        <CardHeader title={props.view.name}/>
        <CardContent>
            <Typography variant="body2" component="p">
                {props.view.description}
            </Typography> 
            </CardContent>
            <Checkbox></Checkbox>
    </Card>
}