import React, { useState } from "react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

import fijiIcon from "./fiji_icon.png";
const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    fijiCopy: {
      height: "1em"
    }
  })
);

export default function ClipboardLink({ link }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <a href={link}>AWS</a>
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(link);
          setOpen(true);
        }}
      >
        <img src={fijiIcon} alt="copy fiji link" className={classes.fijiCopy} />
      </IconButton>
      <IconButton
        color="primary"
        onClick={() => {
          navigator.clipboard.writeText(link);
          setOpen(true);
        }}
      >
        <AssignmentIcon />
      </IconButton>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        message={"Copied to clipboard"}
      />
    </>
  );
}
