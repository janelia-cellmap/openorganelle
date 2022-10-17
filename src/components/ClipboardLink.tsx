import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@mui/material/styles";

import { Assignment,
         FolderOpen,
         Help} from "@mui/icons-material";

import {Button, Snackbar, Typography, Tooltip } from '@mui/material';
import fijiIcon from "./fiji_icon.png";

import { HashLink } from "react-router-hash-link";
import { LinkProps as RouterLinkProps } from "react-router-dom";
const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    FileBrowser: {
      height: "1em"
    },
    fijiCopy: {
      height: "1em"
    },
    title: {
      color: theme.palette.primary.main
    }
  })
);

interface ClipBoardLinkProps {
  bucketBrowseLink: string;
  s3URL: string;
}

const DataFaqLink = (props:any , ref:any) => {
  return (
    <HashLink ref={ref} to="/faq#data_access" {...props} />
  );
}

const LinkBehavior = React.forwardRef<any, Omit<RouterLinkProps, "to">>(
  DataFaqLink
);

export default function ClipboardLink({
  bucketBrowseLink,
  s3URL
}: ClipBoardLinkProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        Data Access
      </Typography>
      <Tooltip title="Learn how to access data" aria-label="data access link">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          component={LinkBehavior}
          startIcon={<Help />}
          rel="noopener noreferrer"
          style={{ marginBottom: "1rem" }}
        >
          How to access data
        </Button>
      </Tooltip>

      <Tooltip title="Browse raw data on s3" aria-label="file browser link">
        <Button
          variant="contained"
          color="primary"
          href={bucketBrowseLink}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          startIcon={<FolderOpen />}
          style={{ marginBottom: "1rem" }}
        >
          Browse the files
        </Button>
      </Tooltip>
      <Tooltip
        title="Copy data URI to clipboard"
        aria-label="copy data URI to clipboard 1"
      >
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => {
            navigator.clipboard.writeText(s3URL);
            setOpen(true);
          }}
          style={{ marginBottom: "1rem" }}
          startIcon={
            <img
              src={fijiIcon}
              alt="copy fiji link"
              className={classes.fijiCopy}
            />
          }
        >
          Copy Fiji link
        </Button>
      </Tooltip>

      <Tooltip
        title="Copy data URI to clipboard"
        aria-label="copy data URI to clipboard 2"
      >
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<Assignment />}
          style={{ marginBottom: "1rem" }}
          onClick={() => {
            navigator.clipboard.writeText(s3URL);
            setOpen(true);
          }}
        >
          Copy Data URI
        </Button>
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
