import React from "react";
import { Volume } from "../api/datasets";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";


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
  const contentType = volumes[0].contentType;
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
    <React.Fragment key={contentType}>
      <FormLabel component="legend" style={{ fontWeight: "bold", marginTop: "1em" }}>
        {contentTypeProps.get(contentType)}
      </FormLabel>
      <Divider />
      <FormGroup>{checkBoxList}</FormGroup>
    </React.Fragment>
  );
}


