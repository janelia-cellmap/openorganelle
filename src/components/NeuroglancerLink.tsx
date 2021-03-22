import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import { Dataset, DatasetView, LayerTypes, Volume } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";
import { ImageLayer, Layer, SegmentationLayer } from "@janelia-cosem/neuroglancer-url-tools";

interface VolumeCheckStates {
  selected: boolean
  layerType?: LayerTypes
}

interface VolumeCheckStates {
  selected: boolean
  layerType?: LayerTypes
}

type NeuroglancerLinkProps = {
  dataset: Dataset;
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
  const {appState} = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;

  const local_view = { ...view };
  local_view.volumeKeys = [];
  dataset.volumes.forEach((value: Volume, key: string) => {
    if (checkState.get(key)?.selected) {
      local_view.volumeKeys.push(key);
    }
  });

  let ngLink = "";
  
  const disabled = Boolean(local_view.volumeKeys.length === 0);
  const layers = local_view.volumeKeys.map(vk => {
    let layerType = checkState.get(vk)?.layerType
    if (layerType === undefined) {
      layerType = dataset.volumes.get(vk)?.displaySettings.defaultLayerType;
    }
    let result = dataset.volumes.get(vk)!.toLayer(layerType as LayerTypes);
    return result;
  });
  if (!disabled) {
    ngLink = `${neuroglancerAddress}${dataset.makeNeuroglancerViewerState(
      layers as SegmentationLayer[] | ImageLayer[],
      local_view.position,
      local_view.scale)}`;
  }

  if (children) {
    return <>
    {React.Children.map(children, child => {
      const updatedProps = {
        disabled,
        href: ngLink,
        target: "_blank",
        rel: "noopener noreferrer"
      };
      if (React.isValidElement(child)) {
        return React.cloneElement(child, updatedProps);
      }
      return child;
    })}
    </>;
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
