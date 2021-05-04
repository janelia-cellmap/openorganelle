import React, { useState, useEffect } from "react";
import { Volume, ContentTypeMetadata, ContentType } from "../api/datasets";
import { Checkbox, FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { VolumeCheckStates } from "./DatasetPaper";

interface LayerTypeToggleProps {
  label: string
  checked: boolean
  contentType: ContentType
  handleLayerChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface VolumeCheckboxCollectionProps {
  volumes: Volume[]
  checkState: Map<string, VolumeCheckStates>
  handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  contentType: string,
  contentTypeInfo: ContentTypeMetadata,
  accordionExpanded: boolean
  layerTypeToggleLabel?: string,
  layerTypeToggleChecked?: boolean
  handleLayerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const LayerTypeSwitch = ({label, checked, contentType, handleLayerChange}: LayerTypeToggleProps) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleLayerChange} name={contentType} />}
        label={label}
      />
    </FormGroup>
  );
}

export default function VolumeCheckboxCollection({
  volumes,
  checkState,
  handleVolumeChange,
  contentType,
  contentTypeInfo,
  accordionExpanded,
  layerTypeToggleLabel,
  handleLayerChange
}: VolumeCheckboxCollectionProps) {
  const [expanded, setExpanded] = useState(accordionExpanded);
  
  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const checkBoxList = volumes?.map((volume: Volume) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkState.get(volume.name)!.selected}
            onChange={handleVolumeChange}
            color="primary"
            name={volume.name}
            size="small"
          />
        }
        label={volume.description}
        key={`${volume.name}`}
      />
    );
  });
  
  let layerTypeSwitch;
  if (!(layerTypeToggleLabel === undefined) && !(handleLayerChange === undefined)) {
    layerTypeSwitch = LayerTypeSwitch({label: layerTypeToggleLabel, checked: checkState.get(volumes[0].name)?.layerType === 'segmentation', contentType: (contentType as ContentType), handleLayerChange: handleLayerChange});
  }
  else {
    layerTypeSwitch = undefined;
  }
  
  return (
    <Accordion key={contentType} expanded={expanded} onChange={handleExpand}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="content"
        id="panel1bh-header"
      >
      <Typography>{contentTypeInfo.label}</Typography>
      </AccordionSummary>
      <Typography
        variant="body2"
        style={{ margin: "0 1em", color: "rgba(0,0,0,0.5)" }}
      >
        {contentTypeInfo.description}
      </Typography>
      {layerTypeSwitch}
      <AccordionDetails>
        <FormGroup>{checkBoxList}</FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
