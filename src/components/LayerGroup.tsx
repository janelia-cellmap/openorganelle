import React, { useState, useEffect } from "react";
import { Volume } from "../api/datasets";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

type LayerCheckBoxListProps = {
  volumes: Volume[];
  checkState: Map<string, boolean>;
  handleChange: any;
  contentTypeProps: any;
};

export default function LayerGroup({
  volumes,
  checkState,
  handleChange,
  contentTypeProps
}: LayerCheckBoxListProps) {
  const [expanded, setExpanded] = useState(true);
  const contentType = volumes[0].contentType;

  useEffect(() => {
    if (contentType !== "em") {
      setExpanded(false);
    }
  }, [contentType]);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const checkBoxList = volumes?.map((volume: Volume) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkState.get(volume.name)}
            onChange={handleChange}
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

  return (
    <Accordion key={contentType} expanded={expanded} onChange={handleExpand}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="content"
        id="panel1bh-header"
      >
        <Typography>{contentTypeProps.get(contentType)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography><FormGroup>{checkBoxList}</FormGroup></Typography>
      </AccordionDetails>
    </Accordion>
  );
}
