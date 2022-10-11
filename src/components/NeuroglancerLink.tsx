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
import { makeLayer, makeNeuroglancerViewerState, outputDimensions } from "../api/neuroglancer";

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

  const local_view = { ...view };
  local_view.sourceNames = [];
  const volumeMap = new Map(dataset.images.map((v) => [v.name, v]))
  for (let key of volumeMap.keys()) {
    if (checkState.get(key)?.selected) {
      local_view.sourceNames.push(key);
    }
  }

  let ngLink = "";

  const disabled = Boolean(local_view.sourceNames.length === 0);
  const layers = local_view.sourceNames.map(vk => {
    let layerType = "segmentation";
    let sampleType = volumeMap.get(vk)?.sampleType;
    if (sampleType === "scalar") {
      layerType = "image";
    }
    let result = makeLayer(volumeMap.get(vk)!, layerType as LayerType, outputDimensions);
    return result;
  });
  if (!disabled) {
    ngLink = `${neuroglancerAddress}${makeNeuroglancerViewerState(
      layers as SegmentationLayer[] | ImageLayer[],
      local_view.position,
      local_view.scale,
      local_view.orientation,
      outputDimensions)}`;
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
