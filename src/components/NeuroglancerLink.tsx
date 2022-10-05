import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import {
  DatasetView,
  LayerTypes
} from "../api/datasets";
import { AppContext } from "../context/AppContext";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";
import {
  ImageLayer,
  SegmentationLayer
} from "@janelia-cosem/neuroglancer-url-tools";
import { TaggedDataset } from "../context/DatasetsContext";
import { makeLayerV2, makeNeuroglancerViewerState, outputDimensions } from "../api/neuroglancer";

interface VolumeCheckStates {
  selected: boolean;
  layerType?: LayerTypes;
}

interface VolumeCheckStates {
  selected: boolean;
  layerType?: LayerTypes;
}

type NeuroglancerLinkProps = {
  dataset: TaggedDataset;
  view: DatasetView;
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
  local_view.sources = [];
  const volumeMap = new Map(dataset.volumes.map((v) => [v.name, v]))
  for (let key of volumeMap.keys()) {
    if (checkState.get(key)?.selected) {
      local_view.sources.push(key);
    }
  }

  let ngLink = "";

  const disabled = Boolean(local_view.sources.length === 0);
  const layers = local_view.sources.map(vk => {
    let layerType = "segmentation";
    let sampleType = volumeMap.get(vk)?.sample_type;
    if (sampleType === "scalar") {
      layerType = "image";
    }
    let result = makeLayerV2(volumeMap.get(vk)!, layerType as LayerTypes, outputDimensions);
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
