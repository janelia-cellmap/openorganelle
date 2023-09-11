import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import {Imagery} from "../types/database"
import { AppContext } from "../context/AppContext";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";
import { outputDimensions, makeNeuroglancerUrl } from "../api/neuroglancer";


type NeuroglancerLinkProps = {
  position?: number[] | null
  scale?: number | null
  orientation?: number[] | null
  imagery: Imagery[],
  children?: React.ReactNode;
};

export default function NeuroglancerLink({
  position,
  scale,
  orientation,
  imagery,
  children
}: NeuroglancerLinkProps) {
  const { appState } = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;
  let ngLink = "";
  
  const disabled = imagery.length === 0;
  if (!disabled) {
    ngLink = makeNeuroglancerUrl({position, scale, orientation, imagery, outputDimensions, host: neuroglancerAddress})
  }
  if (children) {
    return (
      <>
        {React.Children.map(children, child => {
          return (<a href={ngLink} target="_blank" rel="noopener noreferrer">{child}</a>);
        })}
      </>
    );
  } else {
    return (
      <>
        <Button
          variant="contained"
          disabled={disabled}
          color="primary"
          href={ngLink}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<LaunchIcon fontSize="small" />}
        >
          View
        </Button>
        {disabled ? " - select layers to view." : ""}
        {!webGL2Enabled && <WarningIcon />}
      </>
    );
  }
}
