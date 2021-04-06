import React from "react";
import { useLocation } from "react-router-dom";
import Card from "@material-ui/core/Card";

import AnalysisResults from "./AnalysisResults";
import AnalysisForm from "./AnalysisForm";
import cypherBuilder from "../utils/cypherBuilder";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Analysis() {
  const query = useQuery();

  const measurements = query.get("m") || "";

  const state = {
    dataset: query.get("ds") || "",
    organelleA: query.get("oa") || "",
    organelleB: query.get("ob") || "",
    measurements: measurements.split(",").filter(item => item !== "")
  };

  const cypher = cypherBuilder(state);

  return (
    <div className="content">
      <AnalysisForm />
      <Card style={{ padding: "1em", margin: "1em" }}>
        <code>{cypher}</code>
      </Card>
      {cypher ? (
        <AnalysisResults
          cypher={cypher}
          organelleA={state.organelleA}
          organelleB={state.organelleB}
        />
      ) : (
        <p> Please select a dataset, organelle and measurements from above</p>
      )}
    </div>
  );
}
