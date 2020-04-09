import React from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import logo from "../COSEM_logo_invert_transparent.png";
import janelia from "../janelia_logo.png";

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: "none",
    marginLeft: "1em"
  },
  spacer: {
    flexGrow: 1
  },
  logo: {
    maxHeight: "70px",
    marginRight: theme.spacing(2)
  },
  janeliaLogo: {
    maxHeight: "52px",
    marginRight: theme.spacing(2)
  },
  appbar: {
    /* Chrome 10-25, Safari 5.1-6 */
    background: "#303030"
  }
}));

export default function Navigation() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar variant="dense">
        <a href="https://janelia.org" className={classes.link}>
          <img
            src={janelia}
            alt="Janelia Research Campus"
            className={classes.janeliaLogo}
          />
        </a>
        <Link className={classes.link} to="/">
          <img
            src={logo}
            alt="COSEM"
            className={classes.logo}
          />
        </Link>
        <div className={classes.spacer} />
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
    </AppBar>
  );
}
