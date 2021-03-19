import React from "react";

interface resultsProps {
  cypher: string | undefined
};

export default function AnalysisResults({cypher}: resultsProps) {

  if (!cypher) {
    return (<p> Please select a dataset, organelle and measurements from above</p>);
  }
  return (<p>Results for query {cypher} here</p>);
}
