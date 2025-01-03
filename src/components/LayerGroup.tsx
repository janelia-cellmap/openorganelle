import React, { useState } from "react";
import { ContentTypeMetadata } from "../api/datasets";
import {Image} from "../types/database"
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface ImageCheckboxCollectionProps {
  images: Image[]
  checkState: Set<string>
  handleImageStackChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  contentType: string,
  contentTypeInfo: ContentTypeMetadata,
  accordionExpanded: boolean
  layerTypeToggleLabel?: string,
  layerTypeToggleChecked?: boolean
}


export default function ImageCheckboxCollection({
  images,
  checkState,
  handleImageStackChange,
  contentType,
  contentTypeInfo,
  accordionExpanded,
}: ImageCheckboxCollectionProps) {
  const [expanded, setExpanded] = useState(accordionExpanded);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  // combine images into image stacks
  const imageStacks = images.reduce((result: Record<string, Image[]> , image: Image) => {
    const image_stack: string = image.imageStack;
    (result[image_stack] = result[image_stack] || []).push(image);
    return result;
  }, {});

  let checkBoxList : Array<object> = [];

  // map a function over the dictionary
  function objectMap( dict : Record<string, Image[]>, mappedFunction : (dict: Record<string, Image[]>, key: string) => object) : object[] {
    return Object.values(Object.keys(dict).reduce(function(result : Record<string, object>, key : string) {
      result[key] = mappedFunction(dict, key)
      return result
    }, {}))
  }

  checkBoxList = objectMap(imageStacks, (imageStacks: Record<string, Image[]>, stackName : string) => {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.has(imageStacks[stackName][0].name)}
              onChange={handleImageStackChange}
              color="primary"
              name={stackName}
              size="small"
            />
          }
          label={imageStacks[stackName][0].description}
          key={`${stackName}`}
        />
      );
    })

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
