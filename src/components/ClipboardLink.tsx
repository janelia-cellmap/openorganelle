import React, { useState } from "react";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import FolderOpen from "@material-ui/icons/FolderOpen"
import Tooltip from "@material-ui/core/Tooltip"
import fijiIcon from "./fiji_icon.png";
import { Button } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
import { HashLink } from 'react-router-hash-link';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { MemoryRouter as Router } from 'react-router';
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

const LinkBehavior = React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((props, ref) => (
  <HashLink ref={ref} to="/tutorials#data_access" {...props} />
));

export default function ClipboardLink({ bucketBrowseLink, s3URL }: ClipBoardLinkProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Browse raw data on s3" aria-label="file browser link">
      <Button variant="contained" color="primary" href={bucketBrowseLink} target="_blank" rel= "noopener noreferrer" startIcon={<FolderOpen/>}> Browse files </Button>
      </Tooltip>
      <Router>
      <Tooltip title="Learn how to access data" aria-label="data access link">
      <Button variant="contained" color="primary" component={LinkBehavior} target="_blank" startIcon={<GetApp/>} rel= "noopener noreferrer"> Access data </Button>
      </Tooltip>
      </Router>
      <Tooltip title="Copy data URI to clipboard" aria-label="copy data URI to clipboard 1">
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(s3URL);
          setOpen(true);
        }}
      >
        <img src={fijiIcon} alt="copy fiji link" className={classes.fijiCopy}/>
      </IconButton>
      </Tooltip>
      
      <Tooltip title="Copy data URI to clipboard" aria-label="copy data URI to clipboard 2">
      <IconButton
        color="primary"
        onClick={() => {
          navigator.clipboard.writeText(s3URL);
          setOpen(true);
        }}
      >
        <AssignmentIcon />
      </IconButton>
      </Tooltip>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        message={"Copied to clipboard"}
      />
    </>
  );
}
