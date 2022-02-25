import React from "react";
import { makeStyles } from "tss-react/mui";
import { createStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import {
  ListItemIcon,
  ListItemText,
  Radio
} from "@mui/material";
import { DatasetView } from "../api/datasets";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const useStyles = makeStyles()((theme) =>
  ({
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
  views: DatasetView[];
  checkState: boolean[];
  handleToggle: (val: number, views: DatasetView[]) => () => void | undefined;
}

export default function DatasetViewList({
  views,
  checkState,
  handleToggle
}: DatasetViewListProps) {
  const {classes} = useStyles();

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
                  checked={checkState[idx]}
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
