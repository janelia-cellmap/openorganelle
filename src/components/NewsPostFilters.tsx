import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";

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
          icon={<DoneIcon />}
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
        startIcon={<FilterListIcon />}
      >
        Filter
      </Button>
      {filtersOpen ? <div style={{padding: "1em"}}>{chips}</div> : ""}
    </>
  );
}
