import React, { useState } from "react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import FolderOpen from "@material-ui/icons/FolderOpen"

import fijiIcon from "./fiji_icon.png";
import { Button } from "@material-ui/core";
const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    FileBrowser: {
      height: "1em"
    },
    fijiCopy: {
      height: "1em"
    }
  })
);

interface ClipBoardLinkProps {
  bucketBrowseLink: string
  s3URL: string
}

export default function ClipboardLink({ bucketBrowseLink, s3URL }: ClipBoardLinkProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" href={bucketBrowseLink} target="_blank" rel= "noopener noreferrer" startIcon={<FolderOpen/>}> Browse </Button>
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(s3URL);
          setOpen(true);
        }}
      >
        <img src={fijiIcon} alt="copy fiji link" className={classes.fijiCopy} />
      </IconButton>
      <IconButton
        color="primary"
        onClick={() => {
          navigator.clipboard.writeText(s3URL);
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
