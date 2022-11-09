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

type NeuroglancerLinkProps = {
  dataset: TaggedDataset;
  view: View;
  imageNames?: Set<string> | string[];
  children?: React.ReactNode;
};

export default function NeuroglancerLink({
  dataset,
  view,
  imageNames,
  children
}: NeuroglancerLinkProps) {
  const { appState } = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;

  const localView = { ...view };
  if (imageNames) {
    localView.sourceNames = Array.from(imageNames)
  };
  const volumeMap = new Map(dataset.images.map((v) => [v.name, v]))

  let ngLink = "";

  const disabled = Boolean(localView.sourceNames.length === 0);
  const layers = localView.sourceNames.map(vk => {
    let layerType = "segmentation";
    const sampleType = volumeMap.get(vk)?.sampleType;
    if (sampleType === "scalar") {
      layerType = "image";
    }
    return makeLayer(volumeMap.get(vk)!, layerType as LayerType, outputDimensions);
  });
  if (!disabled) {
    ngLink = `${neuroglancerAddress}${makeNeuroglancerViewerState(
      layers as SegmentationLayer[] | ImageLayer[],
      localView.position,
      localView.scale,
      localView.orientation,
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
