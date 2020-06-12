import React, {useContext, FunctionComponent} from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../context/AppContext";
import WarningIcon from "@material-ui/icons/Warning"
import logo from "../COSEM_logo_invert_transparent.png";
import janelia from "../janelia_logo.png";
import { Grid } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';

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
    background: "#303030",    
  }
}));

const WebGL2CompatibilityWarning: FunctionComponent<any> = (props) => {
  const classes = useStyles();
  return <Grid container justify="center" alignItems="center" spacing={2}>
    <Grid item>
      <WarningIcon/> 
    </Grid>
    <Grid item zeroMinWidth>
    <Typography className={classes.warning}> 
    Warning: your browser does not support neuroglancer.<br/> To view data with neuroglancer, please visit this site with Firefox or Chrome. 
    </Typography>
    </Grid>
    </Grid>
}

const WebGL2CompatibilityWarning2: FunctionComponent<any> = (props) => {
  const classes = useStyles();
  
  return <Grid container alignItems="center" spacing={2}>
    <Grid item>
      <WarningIcon/> 
    </Grid>
    <Grid item zeroMinWidth>
    <Typography variant="body1" className={classes.warning}> 
    Warning: your browser does not support neuroglancer. To view data with neuroglancer, please visit this site with Firefox or Chrome. 
    </Typography>
    </Grid>
    </Grid>
   
}

export default function Navigation() {
  const classes = useStyles();
  const [appState, setAppState] = useContext(AppContext);

  return (
    <React.Fragment>
    <AppBar position="fixed" className={classes.appbar}>
      <Toolbar variant="dense">
        <a href="https://www.janelia.org" className={classes.link}>
          <img
            src={janelia}
            alt="Janelia Research Campus"
            className={classes.janeliaLogo}
          />
        </a>
        <a href="https://www.janelia.org/project-team/cosem">
          <img src={logo} alt="COSEM" className={classes.logo} />
        </a>
        <a href="https://www.janelia.org/lab/hess-lab" className={classes.link}>
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
      {!appState.webGL2Enabled && <WebGL2CompatibilityWarning2/>}            
    </AppBar>
    <Toolbar/>        
    </React.Fragment>
  );
}
