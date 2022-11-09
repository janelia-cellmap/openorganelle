import React, { useState } from "react";
import { Image, ContentTypeMetadata } from "../api/datasets";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";

interface ImageCheckboxCollectionProps {
  images: Image[]
  checkState: Set<string>
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  layerTypeToggleLabel?: string,
  layerTypeToggleChecked?: boolean
  handleLayerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}


export default function ImageCheckboxCollection({
    images,
    checkState,
    handleImageChange,
  }: ImageCheckboxCollectionProps) {
      
    const selectedCheckBoxList = images.filter((im) => true).map((image: Image) => {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={true}
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

    const unselectedCheckBoxList = images?.map((image: Image) => {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={false}
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
      <>
      <FormGroup>{selectedCheckBoxList}</FormGroup>
      <FormGroup>{unselectedCheckBoxList}</FormGroup>
      </>
    );
  }


