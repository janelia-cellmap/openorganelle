import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import TwitterIcon from '@material-ui/icons/Twitter';

import cellmapLogo from "./cellmapLogoDarkText.png";
import fibsemLogo from "../fibsem_logo.png";

const cellmapURL = "https://www.janelia.org/project-team/cellmap";
const hessURL = "https://www.janelia.org/lab/hess-lab";
const fibsemURL = "https://www.janelia.org/project-team/fib-sem-technology";

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: "none",
    marginLeft: "1em",
    display: "inline-block"
  },
  cellmapLogo: {
    maxHeight: "50px",
    marginRight: theme.spacing(2)
  },
  footer: {
    padding: "1em 1em 0.5em 1em",
    background: "#333",
    color: "#fff",
    flexShrink: 0
  },
  hessLink: {
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
    fontSize: "1.3em",
    marginLeft: "1em",
    textDecoration: "none"
  },
  linkContainer: {
    display: "flex",
    justifyContent: "center" /* align horizontal */,
    alignItems: "center" /* align vertical */
  },
  footerMiddle: {
    textAlign: "center"
  },
  mailLink: {
    display: "flex",
    alignItems: "center",
    color: "#fff"
  }
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <p>Contact us</p>
          <a href="https://twitter.com/OpenOrganelle" className={classes.mailLink}>
            <TwitterIcon style={{marginRight: "1rem"}}/> @OpenOrganelle
          </a>
          <a href="mailto:cosemdata@janelia.hhmi.org" className={classes.mailLink}>
            <MailOutlineIcon style={{marginRight: "1rem"}}/> cosemdata@janelia.hhmi.org
          </a>
        </Grid>
        <Grid item md={6} className={classes.footerMiddle}>
          <div className={classes.linkContainer}>
            <a
              href={cellmapURL}
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={cellmapLogo} alt="Cellmap" className={classes.cellmapLogo} />
            </a>
            <a href={fibsemURL} target="_blank" rel="noopener noreferrer">
              <img
                src={fibsemLogo}
                alt="FIB-SEM Technology"
                className={classes.cellmapLogo}
              />
            </a>
            <a
              href={hessURL}
              className={classes.hessLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hess Lab
            </a>
          </div>
          <p>
            &copy; 2020 HHMI -{" "}
            <Link style={{ color: "#fff" }} to="/terms_of_use">
              Terms of Use
            </Link>
          </p>
        </Grid>
      </Grid>
    </footer>
  );
}
