import React, { useState, useEffect } from "react";
import { Volume } from "../api/datasets";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
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
  const [expanded, setExpanded] = useState(false);
  const contentType = volumes[0].contentType;

  useEffect(() => {
    if (contentType === "em") {
      setExpanded(true);
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

  const groupTitle = (
    <Typography>{contentTypeProps.get(contentType)}</Typography>
  );
  let groupSummary;
  if (contentType === "segmentation") {
    groupSummary =
      "Predictions that have undergone refinements such as, thresholding, smoothing, size filtering, and connected component analysis.";
  }
  if (contentType === "prediction") {
    groupSummary =
      "Raw distance transform inferences scaled from 0 to 255. A voxel value of 127 represent a predicted distance of 0 nm.";
  }

  return (
    <Accordion key={contentType} expanded={expanded} onChange={handleExpand}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="content"
        id="panel1bh-header"
      >
        {groupTitle}
      </AccordionSummary>
      <Typography
        variant="body2"
        style={{ margin: "0 1em", color: "rgba(0,0,0,0.5)" }}
      >
        {groupSummary}
      </Typography>
      <AccordionDetails>
        <FormGroup>{checkBoxList}</FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
