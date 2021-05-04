import React from "react";
import { useLocation } from "react-router-dom";
import Card from "@material-ui/core/Card";

import AnalysisResults from "./AnalysisResults";
import AnalysisForm from "./AnalysisForm";
import AnalysisConnections from "./AnalysisConnections";
import cypherBuilder, { connectionsCypher } from "../utils/cypherBuilder";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Analysis() {
  const query = useQuery();
  const intId = query.get("id");
  const dataset = query.get("ds") || "";

  if (intId) {
    // TODO: when clicking on a node, the backend should load in all the
    // nodes connected to that node with the following query
    // MATCH (n) WHERE id(n) = 16256397 MATCH (n)-[r]-(c)  RETURN n, r, c
    // This can then be displayed as a 3d graphic and table of data. The
    // id needs to come from the url or the previous cypher query used
    // to fetch the original data set.
    const cypher = connectionsCypher(intId);
    return (
      <div className="content">
        <AnalysisForm />
        <AnalysisConnections cypher={cypher} datasetKey={dataset} />
      </div>
    );
  } else {
    const state = {
      dataset,
      organelleA: query.get("oa") || "",
      organelleB: query.get("ob") || "",
      measurements: query.getAll("m") || []
    };

    const cypher = cypherBuilder(state);
    return (
      <div className="content">
        <AnalysisForm />
        {cypher ? (
          <>
            {process.env.NODE_ENV !== "production" ? (
              <Card style={{ padding: "1em", margin: "1em" }}>
                <code>{cypher}</code>
              </Card>
            ) : (
              ""
            )}
            <AnalysisResults
              cypher={cypher}
              organelleA={state.organelleA}
              organelleB={state.organelleB}
            />
          </>
        ) : (
          <p> Please select a dataset, organelle and measurements from above</p>
        )}
      </div>
    );
  }
}
