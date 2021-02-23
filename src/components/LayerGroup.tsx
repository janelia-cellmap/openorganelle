import React, { useState, useEffect } from "react";
import { Volume, contentTypeDescriptions } from "../api/datasets";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

type LayerCheckBoxListProps = {
  volumes: Volume[];
  checkState: Map<string, boolean>;
  handleChange: any;
  contentTypeProps: any;
};

/*
  const [formats, setFormats] = React.useState(() => ['bold', 'italic']);
  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
      setFormats(newFormats);
    };

<ToggleButtonGroup value={formats} onChange={handleFormat} aria-label="text formatting">
<ToggleButton value="bold" aria-label="bold" selected={true}>
  <Typography variant='body2'> {"View as labels"} </Typography>
</ToggleButton>
<ToggleButton value="italic" aria-label="italic" selected={false}>
<Typography> {"View as intensities"} </Typography>
</ToggleButton></ToggleButtonGroup>
*/


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
  let groupSummary = contentTypeDescriptions.get(contentType) ? contentTypeDescriptions.get(contentType) : '';


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
