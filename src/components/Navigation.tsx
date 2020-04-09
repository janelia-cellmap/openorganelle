import React from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import logo from "../logo.png";
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
    maxHeight: "40px",
    marginRight: theme.spacing(2)
  },
  appbar: {
    /* Chrome 10-25, Safari 5.1-6 */
    background: "-webkit-linear-gradient(to right, #048c94,#50a96e,#8ac04a)",
    background: "linear-gradient(to right, #048c94,#50a96e,#8ac04a)"
  }
}));

export default function Navigation() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar variant="dense">
        <Link className={classes.link} to="/">
          <img src={logo} alt="cosem logo" className={classes.logo} />
        </Link>
        <Link className={classes.link} to="/">
          <Typography variant="h6" color="inherit" noWrap>
            Data portal
          </Typography>
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
        <a href="https://janelia.org" className={classes.link}>
          <img
            src={janelia}
            alt="Janelia Research Campus"
            className={classes.logo}
          />
        </a>
      </Toolbar>
    </AppBar>
  );
}
