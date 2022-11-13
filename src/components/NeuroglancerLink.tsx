import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import {
  LayerType, TaggedDataset, View
} from "../api/datasets";
import { AppContext } from "../context/AppContext";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";
import {
  ImageLayer,
  SegmentationLayer
} from "@janelia-cosem/neuroglancer-url-tools";
import { makeLayer, makeNeuroglancerViewerState, outputDimensions, viewToNeuroglancerUrl } from "../api/neuroglancer";

interface VolumeCheckStates {
  selected: boolean;
  layerType?: LayerType;
}

interface VolumeCheckStates {
  selected: boolean;
  layerType?: LayerType;
}

type NeuroglancerLinkProps = {
  dataset: TaggedDataset;
  view: View;
  checkState: Map<string, VolumeCheckStates>;
  children?: React.ReactNode;
};

export default function NeuroglancerLink({
  dataset,
  view,
  checkState,
  children
}: NeuroglancerLinkProps) {
  const { appState } = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;
  let ngLink = "";
  const local_view = { ...view };
  local_view.sourceNames = [];
  const volumeMap = new Map(dataset.images.map((v) => [v.name, v]))
  
  for (const key of volumeMap.keys()) {
    if (checkState.get(key)?.selected) {
      local_view.sourceNames.push(key);
    }
  }
  
  const disabled = local_view.sourceNames.length === 0;
  if (!disabled) {
    ngLink = viewToNeuroglancerUrl(local_view,
                                   volumeMap,
                                   outputDimensions,
                                   neuroglancerAddress)
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
