
import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Checkbox, Grid, IconButton, ListItemIcon, ListItemSecondaryAction, ListItemText, Radio } from "@material-ui/core";
import DatasetViewCard from "./DatasetViewCard";
import { DatasetView } from "../api/datasets";
import List from "@material-ui/core/List"
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }),
);

interface DatasetViewListProps {
    views: DatasetView[]
    checkState: boolean[]
    handleToggle: (val: number, views:  DatasetView[]) => () => void | undefined
}

export default function DatasetViewList({views, checkState, handleToggle}: DatasetViewListProps){
    const classes = useStyles();

    return (
        <List className={classes.root}>
            <Typography variant="h6">Select a view</Typography>
          {views.map((value, idx) => {
            const labelId = `checkbox-list-label-${value.name}`;
    
            return (
              <ListItem key={idx} role={undefined} dense button onClick={handleToggle(idx, views)}>
                <ListItemIcon>
                  <Radio
                    edge="start"
                    checked={checkState[idx]}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.name} 
                secondary={value.description}/>
              </ListItem>
            );
          })}
        </List>
      ); 
    }