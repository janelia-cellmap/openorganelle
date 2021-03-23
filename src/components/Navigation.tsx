import React, {useContext} from "react";
import { NavLink, Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import SettingsIcon from '@material-ui/icons/Settings';
import { Grid } from "@material-ui/core";
import { AppContext } from "../context/AppContext";
import janeliaLogo from "../janelia_logo.png";
import {WebGL2CompatibilityWarning} from "./WebGL2Compatibility";
import banner from "./cosem_banner.jpg";


const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
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
  },
    mastheadText: {
      marginTop: "3em",
      fontFamily: "'Proxima Nova W01',Arial,Helvetica,sans-serif",
      padding: "1em",
      position: "absolute",
      bottom: "0",
      left: "1em",
      textShadow: "0 1px 0 black"
    },
    masthead: {
      background: 
        `linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)), url(${banner})`,
      backgroundPositionX: "right",
      backgroundSize: "cover",
      minHeight: "200px",
      position: "relative",
      color: "#fff",
      margin: "62px 0 0 -1em"
    },
    secondaryNav: {
      background: "#27507C",
      color: "#fff",
      minHeight: "40px",
      margin: "0 0 0 -1em"
    },
    navList: {
      display: "block",
      marginTop: 0
    },
    navListItem: {
      color: "#ccc",
      borderBottom: "8px solid transparent",
      display: "inline-block",
      padding: "12px 0 2px 0",
      marginRight: "0.8em",
      textAlign: "center",
      minWidth: "5em"
    },
    homeLink: {
      color: "#fff",
      textDecoration: "none"
    }

  })
);

export default function Navigation() {
  const classes = useStyles();
  const {appState} = useContext(AppContext);

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
          <SettingsIcon />
        </Link>
      </Toolbar>
      {!appState.webGL2Enabled && <WebGL2CompatibilityWarning/>}
    </AppBar>
    <div className={classes.masthead}>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={10} md={6} className={classes.mastheadText}>
          <Typography variant="h3">
            <Link className={classes.homeLink} to="/">
              OpenOrganelle
            </Link>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Explore cells and tissue at nanometer resolution
          </Typography>
        </Grid>
      </Grid>
    </div>
      <div className={classes.secondaryNav}>
        <ul className={classes.navList}>
          <NavLink exact to="/">
            <li className={classes.navListItem}>Datasets</li>
          </NavLink>
          <NavLink to="/tutorials">
            <li className={classes.navListItem}>Tutorials</li>
          </NavLink>
          <NavLink to="/organelles">
            <li className={classes.navListItem}>Organelles</li>
          </NavLink>
          <NavLink to="/code">
            <li className={classes.navListItem}>Code</li>
          </NavLink>
          <NavLink to="/publications">
            <li className={classes.navListItem}>Publications</li>
          </NavLink>
          <NavLink to="/analysis">
            <li className={classes.navListItem}>Analysis</li>
          </NavLink>
        </ul>
      </div>
  </>
  );
}
