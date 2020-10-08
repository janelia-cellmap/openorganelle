import React, {useContext} from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../context/AppContext";
import janeliaLogo from "../janelia_logo.png";
import {WebGL2CompatibilityWarning} from "./WebGL2Compatibility";

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: "none",
    marginLeft: "1em",
  },
  warning: {
    color: theme.palette.warning.light
  },
  spacer: {
    flexGrow: 1
  },
  cosemLogo: {
    maxHeight: "70px",
    marginRight: theme.spacing(2)
  },
  janeliaLogo: {
    maxHeight: "52px",
    marginRight: theme.spacing(2)
  },
  appbar: {
    /* Chrome 10-25, Safari 5.1-6 */
    background: "#333",
  },
  toolbar: {
    minHeight: "54px",
  }
}));

export default function Navigation() {
  const classes = useStyles();
  const [appState, ] = useContext(AppContext);

  return (
    <>
    <AppBar position="fixed" className={classes.appbar}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <a href="https://www.janelia.org" className={classes.link} target="_blank" rel="noopener noreferrer">
          <img
            src={janeliaLogo}
            alt="Janelia Research Campus"
            className={classes.janeliaLogo}
          />
        </a>
        <div className={classes.spacer} />
        <Link className={classes.link} to="/">
          <Typography variant="h6" color="inherit" noWrap>
            Home
          </Typography>
        </Link>
        <Link className={classes.link} to="/about">
          <Typography variant="h6" color="inherit" noWrap>
            About
          </Typography>
        </Link>
        <Link className={classes.link} to="/settings">
          <Typography variant="h6" color="inherit" noWrap>
            Settings
          </Typography>
        </Link>
      </Toolbar>
      {!appState.webGL2Enabled && <WebGL2CompatibilityWarning/>}
    </AppBar>
    </>
  );
}
