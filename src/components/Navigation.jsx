import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit">
          <Link to="/">COSEM</Link>
        </Typography>
        <Link to="/about">About</Link>
      </Toolbar>
    </AppBar>
  );
}
