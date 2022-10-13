import React, { useState } from "react";
import { Image, ContentTypeMetadata } from "../api/datasets";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ImageCheckState } from "./DatasetPaper";

interface ImageCheckboxCollectionProps {
  images: Image[]
  checkState: Map<string, ImageCheckState>
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  contentType: string,
  contentTypeInfo: ContentTypeMetadata,
  accordionExpanded: boolean
  layerTypeToggleLabel?: string,
  layerTypeToggleChecked?: boolean
  handleLayerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}


export default function ImageCheckboxCollection({
  images,
  checkState,
  handleImageChange,
  contentType,
  contentTypeInfo,
  accordionExpanded,
}: ImageCheckboxCollectionProps) {
  const [expanded, setExpanded] = useState(accordionExpanded);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const checkBoxList = images?.map((image: Image) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkState.get(image.name) ? checkState.get(image.name)?.selected : false }
            onChange={handleImageChange}
            color="primary"
            name={image.name}
            size="small"
          />
        }
        label={image.description}
        key={`${image.name}`}
      />
    );
  });

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
      <AccordionDetails>
        <FormGroup>{checkBoxList}</FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
