import React from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

import logo from '../logo.png';

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none'
  },
  spacer: {
    flexGrow: 1
  },
  logo: {
    maxHeight: '40px',
    marginRight: theme.spacing(2)
  }
}));


export default function Navigation() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Link className={classes.link} to="/">
          <img src={logo} alt="cosem logo" className={classes.logo}/>
        </Link>
        <Link className={classes.link} to="/">
          <Typography variant="h6" color="inherit" noWrap>
            COSEM
          </Typography>
        </Link>
        <div className={classes.spacer} />
        <Link className={classes.link} to="/about">
          <Typography variant="h6" color="inherit" noWrap>
            About
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
