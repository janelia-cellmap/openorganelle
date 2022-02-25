import React, {FunctionComponent} from "react";
import WarningIcon from "@mui/icons-material/Warning"
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) =>
  ({
    warning: {
      color: theme.palette.warning.main
    }
  })
);


export const WebGL2CompatibilityWarning: FunctionComponent<any> = (props) => {
    const {classes} = useStyles();    
    return <div>
      <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <WarningIcon/> 
      </Grid>
      <Grid item zeroMinWidth>
      <Typography variant="body1" className={classes.warning}> 
      Warning: your browser does not support neuroglancer. To view data with neuroglancer, please visit this site with Firefox or Chrome. 
      </Typography>
      </Grid>
      </Grid>
      </div>
     
  }