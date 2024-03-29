import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  ListItemIcon,
  ListItemText,
  Radio
} from "@material-ui/core";
import { View } from "../types/database";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      height: "440px",
      overflow: "scroll"
    },
    inline: {
      display: "inline"
    }
  })
);

interface DatasetViewListProps {
  views: View[];
  checkState: number;
  handleToggle: (val: number, views: View[]) => () => void | undefined;
}

export default function DatasetViewList({
  views,
  checkState,
  handleToggle
}: DatasetViewListProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6">1. Select a view</Typography>
      <List className={classes.root}>
        {views.map((value, idx) => {
          const labelId = `checkbox-list-label-${value.name}`;

          return (
            <ListItem
              key={idx}
              role={undefined}
              dense
              button
              onClick={handleToggle(idx, views)}
            >
              <ListItemIcon>
                <Radio
                  edge="start"
                  checked={checkState == idx}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={<b>{value.name}</b>}
                secondary={<span style={{textIndent: "1em", padding: 0, margin: 0}}>{value.description}</span>}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
