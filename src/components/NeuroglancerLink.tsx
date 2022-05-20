import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import {
  Dataset,
  DatasetView,
  LayerTypes,
  makeLayer,
  Volume
} from "../api/datasets";
import { AppContext } from "../context/AppContext";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";
import {
  ImageLayer,
  SegmentationLayer
} from "@janelia-cosem/neuroglancer-url-tools";

import {components} from "../api/schema"
import { IFoob } from "../api/datasets2";

type IDataset = components["schemas"]["Dataset"]
type IView = components["schemas"]["View"]

interface VolumeCheckStates {
  selected: boolean;
  layerType?: LayerTypes;
}

interface VolumeCheckStates {
  selected: boolean;
  layerType?: LayerTypes;
}

type NeuroglancerLinkProps = {
  dataset: IFoob;
  view: IView;
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
  local_view.source_names = [];
  dataset.volume_map.forEach((value, key) => {
    if (checkState.get(key)?.selected) {
      local_view.source_names.push(key);
    }
  });

  let ngLink = "";

  const disabled = Boolean(local_view.source_names.length === 0);
  const layers = local_view.source_names.map(vk => {
    let layerType = "segmentation";
    let sampleType = dataset.volume_map.get(vk)?.sample_type;
    if (sampleType === "scalar") {
      layerType = "image";
    }
    let result = makeLayer(dataset.volume_map.get(vk)!, layerType as LayerTypes);
    return result;
  });
  if (!disabled) {
    ngLink = `${neuroglancerAddress}${makeNeuroglancerViewerState(
      layers as SegmentationLayer[] | ImageLayer[],
      local_view.position,
      local_view.scale,
      local_view.orientation
    )}`;
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
