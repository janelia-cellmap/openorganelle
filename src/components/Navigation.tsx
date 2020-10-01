import React, {useContext} from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../context/AppContext";
import cosemLogo from "../COSEM_logo_invert_transparent.png";
import janeliaLogo from "../janelia_logo.png";
import fibsemLogo from "../fibsem_logo.png";
import {WebGL2CompatibilityWarning} from "./WebGL2Compatibility";

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: "none",
    marginLeft: "1em"
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
    background: "#303030",
  }
}));

const cosemURL = "https://www.janelia.org/project-team/cosem"
const hessURL = "https://www.janelia.org/lab/hess-lab"
const fibsemURL = "https://www.janelia.org/lab/fib-sem-technology"

export default function Navigation() {
  const classes = useStyles();
  const [appState, ] = useContext(AppContext);

  return (
    <React.Fragment>
    <AppBar position="fixed" className={classes.appbar}>
      <Toolbar variant="dense">
        <a href="https://www.janelia.org" className={classes.link}>
          <img
            src={janeliaLogo}
            alt="Janelia Research Campus"
            className={classes.janeliaLogo}
          />
        </a>
        <a href={cosemURL} target="_blank" rel="noopener noreferrer">
          <img src={cosemLogo} alt="COSEM" className={classes.cosemLogo} />
        </a>
        <a href={fibsemURL} target="_blank" rel="noopener noreferrer">
          <img src={fibsemLogo} alt="FIB-SEM Technology" className={classes.cosemLogo} />
        </a>
        <a href={hessURL} className={classes.link} target="_blank" rel="noopener noreferrer">
          <Typography variant="h6" color="inherit" noWrap>
            Hess Lab
          </Typography>
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
    <Toolbar/>
    </React.Fragment>
  );
}
