import React, { useState } from "react";
import { Button, Chip } from "@mui/material";
import {FilterList, Done} from "@mui/icons-material";

interface FilterParams {
  tags: string[];
  selected: string[];
  onClick: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function NewsPostFilters({
  tags,
  selected,
  onClick,
}: FilterParams) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleFilterToggle = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleClick = (tag: string) => {
    onClick((current: string[]) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }
      current.push(tag);
      return [...current];
    });
  };

  const chips = tags.map((tag) => {
    const isSelected = selected.includes(tag);
    if (isSelected) {
      return (
        <Chip
          icon={<Done />}
        style={{margin: "0.3em"}}
          onClick={() => handleClick(tag)}
          key={tag}
          label={tag}
        />
      );
    }
    return <Chip style={{margin: "0.3em"}}  onClick={() => handleClick(tag)} key={tag} label={tag} />;
  });

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleFilterToggle}
        startIcon={<FilterList />}
      >
        Filter
      </Button>
      {filtersOpen ? <div style={{padding: "1em"}}>{chips}</div> : ""}
    </>
  );
}
