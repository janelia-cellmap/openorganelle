import React, {FunctionComponent} from "react";
import WarningIcon from "@material-ui/icons/Warning"
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    warning: {
      color: theme.palette.warning.light
    },
  }));


export const WebGL2CompatibilityWarning: FunctionComponent<any> = (props) => {
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